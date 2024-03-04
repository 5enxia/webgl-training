import WebGL from "./webgl";

import fvert from "../assets/particle/shader.vert?raw"
import ffrag from "../assets/particle/shader.frag?raw"
import cvert from "../assets/particle/compute.vert?raw"
import cfrag from "../assets/particle/compute.frag?raw"
import Particle from "./particle2";

interface MousePosition {
  x: number;
  y: number;
}

export default class Renderer {
  private constructor() {}

  // context
  public static canvas: HTMLCanvasElement;
  public static gl: WebGL2RenderingContext;

  // params
  public static uniLocations: Array<WebGLUniformLocation | null> = [];
  public static startTime: number = 0;
  public static FPS = 30;
  public static time = 0;
  public static counter = 0;

  // mouse
  public static mousePosition: MousePosition = { x: 0, y: 0 };
  public static mouseFlag = false;

  // VBO
  public static VBOArray: Array<Array<WebGLBuffer | null>>
  
  // Shader
  public static cprg: WebGLProgram;
  public static attLocation: Array<number> = [];
  public static attStride: Array<number> = [];
  public static uniLocation: Array<WebGLUniformLocation | null> = [];

  public static fprg: WebGLProgram;

  // 初期化
  public static init(canvas: HTMLCanvasElement) {
    // Context
    Renderer.canvas = canvas;
    const gl = WebGL.createContext(canvas);
    if (!gl) return;
    Renderer.gl = gl;

    // Shader
    // transform feedback object
    var transformFeedback = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);

    // out variable names
    var outVaryings = ['vPosition', 'vVelocity', 'vColor'];

    // transform out shader
    var cvs = WebGL.createShaderFromSource(gl, cvert, "vert");
    var cfs = WebGL.createShaderFromSource(gl, cfrag, "frag");
    if (!cvs || !cfs) return;
    var cprg = WebGL.createTransformFeedbackProgram(gl, cvs, cfs, outVaryings);
    if (!cprg) return;
    Renderer.cprg = cprg;

    Renderer.attLocation = [0, 1, 2]
    Renderer.attStride = [3, 3, 4]
    Renderer.uniLocation = [
      gl.getUniformLocation(cprg, 'time'),
      gl.getUniformLocation(cprg, 'mouse'),
      gl.getUniformLocation(cprg, 'move')
    ];

    // draw shader
    const fvs = WebGL.createShaderFromSource(gl, fvert, "vert");
    const ffs = WebGL.createShaderFromSource(gl, ffrag, "frag");
    if (!fvs || !ffs) return;
    var fprg = WebGL.createProgram(gl, fvs, ffs);
    if (!fprg) return;
    Renderer.fprg = fprg;

    // Uniforms
    Renderer.uniLocations[0] = gl.getUniformLocation(fprg, "time");
    Renderer.uniLocations[1] = gl.getUniformLocation(fprg, "mouse");
    Renderer.uniLocations[2] = gl.getUniformLocation(fprg, "resolution");

    // Attribute
    // WebGL.createPlane(gl, prg);
    Particle.init();
    Renderer.VBOArray = [
        [
            WebGL.createVBO(gl, Particle.position),
            WebGL.createVBO(gl, Particle.velocity),
            WebGL.createVBO(gl, Particle.color),
        ],
        [
            WebGL.createVBO(gl, Particle.position),
            WebGL.createVBO(gl, Particle.velocity),
            WebGL.createVBO(gl, Particle.color),
        ]
    ]

    // Flags
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.disable(gl.RASTERIZER_DISCARD);

    // Events
    canvas.addEventListener("mousemove", Renderer.mousemove);
    canvas.addEventListener("mousedown", Renderer.mousedown);
    canvas.addEventListener("mouseup", Renderer.mouseup);

    // Time
    Renderer.startTime = new Date().getTime();

    // Start animation
    Renderer.animate();
  }

  public static animate() {
    Renderer.update();
    Renderer.draw();

    setTimeout(Renderer.animate, 1 / Renderer.FPS);
  }

  private static update() {
    const gl = Renderer.gl;

    // Particle
    var countIndex = Renderer.counter % 2;
    var invertIndex = 1 - countIndex;

    // transform feedback で VBO を更新するシェーダ
    gl.useProgram(Renderer.cprg);

    // 読み込み用 VBO をバインドし、書き込み用を設定する
    WebGL.setAttributes(gl, Renderer.VBOArray[countIndex], Renderer.attLocation, Renderer.attStride);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, Renderer.VBOArray[invertIndex][0]);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, Renderer.VBOArray[invertIndex][1]);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, Renderer.VBOArray[invertIndex][2]);

    // transform feedback の開始を設定
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.beginTransformFeedback(gl.POINTS);

    // uniform 変数などを設定して描画処理を行い VBO に書き込む
    gl.uniform1f(Renderer.uniLocation[0], Renderer.time);
    gl.uniform2fv(Renderer.uniLocation[1], [Renderer.mousePosition.x, Renderer.mousePosition.y]);
    gl.uniform1f(Renderer.uniLocation[2], 1);
    gl.drawArrays(gl.POINTS, 0, Particle.resolutionX * Particle.resolutionY);

    // transform feedback の終了と設定
    gl.disable(gl.RASTERIZER_DISCARD);
    gl.endTransformFeedback();
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, null);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, null);

    // Counter
    Renderer.counter++;

    // Time
    Renderer.time = new Date().getTime() - Renderer.startTime; 

  }

  private static draw() {
    const canvas = Renderer.canvas;
    const gl = Renderer.gl;

    // Clear
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Output
    // gl.uniform1f(Renderer.uniLocations[0], Renderer.time);
    // gl.uniform2fv(Renderer.uniLocations[1], [Renderer.mousePosition.x, Renderer.mousePosition.y]);
    // gl.uniform2fv(Renderer.uniLocations[2], [Renderer.canvas.width, Renderer.canvas.height]);
    // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    // gl.drawArrays(gl.POINTS, 0, Particle.resolutionX * Particle.resolutionY);

    // program
    gl.useProgram(Renderer.fprg);

    // Particle
    var countIndex = Renderer.counter % 2;
    var invertIndex = 1 - countIndex;

    // set vbo
    WebGL.setAttributes(gl, Renderer.VBOArray[invertIndex], Renderer.attLocation, Renderer.attStride);

    // push and render
    gl.drawArrays(gl.POINTS, 0, Particle.resolutionX * Particle.resolutionY);

    gl.flush();
  }

  private static mousemove(e: MouseEvent) {
    Renderer.mousePosition = {
        x: e.offsetX / Renderer.canvas.width * 2 - 1,
        y: e.offsetY / Renderer.canvas.height * -2 + 1,
    }
  }

  private static mousedown(e: MouseEvent) {
    Renderer.mouseFlag = true
  }

  private static mouseup(e: MouseEvent) {
    Renderer.mouseFlag = false
  }
}

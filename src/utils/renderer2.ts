import WebGL from "./webgl";

import fvert from "../assets/particle/shader.vert?raw"
import ffrag from "../assets/particle/shader.frag?raw"
import Particle from "./particle2";

export interface MousePosition {
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

  // Shader
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
    Particle.init(gl, fprg);

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

    // 読み込み用 VBO をバインドし、書き込み用を設定する
    Particle.beginFeedback(gl, Renderer.counter);

    // uniform 変数などを設定して描画処理を行い VBO に書き込む
    Particle.update(gl, Renderer.time, Renderer.mousePosition, Renderer.mouseFlag);
    Particle.endFeedback(gl); // transform feedback の終了と設定

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

    // Particle
    Particle.draw(gl, Renderer.counter);

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

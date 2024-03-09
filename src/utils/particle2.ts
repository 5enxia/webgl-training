import WebGL from "./webgl";
import type { MousePosition } from "./renderer2";

import cvert from "../assets/particle/compute.vert?raw"
import cfrag from "../assets/particle/compute.frag?raw"

export default class Particle {
  private constructor() {}

  // VBO生成
  public static position: number[] = []; // 頂点座標
  public static velocity: number[] = []; // 頂点のベクトル
  public static color: number[] = []; // 頂点の色
  
  public static resolutionX = 100; // 頂点の配置解像度X
  public static resolutionY = 100; // 頂点の配置解像度Y
  public static intervalX = 1.0 / Particle.resolutionX; // 頂点間の間隔X
  public static intervalY = 1.0 / Particle.resolutionY; // 頂点間の間隔Y

  // VBO Array
  public static VBOArray: Array<Array<WebGLBuffer | null>>

  // Shader
  private static cprg: WebGLProgram;
  private static fprg: WebGLProgram;
  public static attLocation: Array<number> = [];
  public static attStride: Array<number> = [];
  public static uniLocation: Array<WebGLUniformLocation | null> = [];

  public static init(gl: WebGL2RenderingContext, fprg: WebGLProgram) {
    // out variable names
    var outVaryings = ['vPosition', 'vVelocity', 'vColor'];
    // transform out shader
    var cvs = WebGL.createShaderFromSource(gl, cvert, "vert");
    var cfs = WebGL.createShaderFromSource(gl, cfrag, "frag");
    if (!cvs || !cfs) return;
    var cprg = WebGL.createTransformFeedbackProgram(gl, cvs, cfs, outVaryings);
    if (!cprg) return;
    Particle.cprg = cprg;

    Particle.attLocation = [0, 1, 2];
    Particle.attStride = [3, 3, 4]
    Particle.uniLocation = [
      gl.getUniformLocation(cprg, 'time'),
      gl.getUniformLocation(cprg, 'mouse'),
      gl.getUniformLocation(cprg, 'move')
    ];

    for (let i = 0; i < Particle.resolutionX; i++) {
      for (let j = 0; j < Particle.resolutionY; j++) {
        // 頂点の座標
        let x = i * Particle.intervalX * 2.0 - 1.0;
        let y = j * Particle.intervalY * 2.0 - 1.0;

        Particle.position.push(x, -y, 0); // 頂点の座標
        let m = Math.sqrt(x * x + y * y);
        Particle.velocity.push(x / m, -y / m, 0); // 頂点のベクトル
        Particle.color.push(1.0, 1.0, 1.0, 1.0); // 頂点の色
      }
    }

    // VBO Array
    Particle.VBOArray = [
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

    Particle.fprg = fprg;
  }

  // uniform 変数などを設定して描画処理を行い VBO に書き込む
  public static update(gl: WebGL2RenderingContext, counter: number, time: number, mousePosition: MousePosition, mouseFlag: boolean) {
    let countIndex = counter % 2;
    let invertIndex = 1 - countIndex;

    // transform feedback で VBO を更新するシェーダ
    gl.useProgram(Particle.cprg);

    WebGL.setAttributes(gl, Particle.VBOArray[countIndex], Particle.attLocation, Particle.attStride);

    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, Particle.VBOArray[invertIndex][0]);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, Particle.VBOArray[invertIndex][1]);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, Particle.VBOArray[invertIndex][2]);

    // transform feedback の開始を設定
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.beginTransformFeedback(gl.POINTS);

    // uniform 変数などを設定して描画処理を行い VBO に書き込む
    gl.uniform1f(Particle.uniLocation[0], time);
    gl.uniform2fv(Particle.uniLocation[1], [mousePosition.x, mousePosition.y]);
    gl.uniform1f(Particle.uniLocation[2], mouseFlag ? 0.1 : 0.01 );
    gl.drawArrays(gl.POINTS, 0, Particle.resolutionX * Particle.resolutionY);

    // transform feedback の終了と設定
    gl.disable(gl.RASTERIZER_DISCARD);
    gl.endTransformFeedback();
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, null);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, null);
  }

  public static draw(gl: WebGL2RenderingContext, counter: number) {
    let countIndex = counter % 2;
    let invertIndex = 1 - countIndex;

    // program
    gl.useProgram(Particle.fprg);

    // set vbo
    WebGL.setAttributes(gl, Particle.VBOArray[invertIndex], Particle.attLocation, Particle.attStride);

    // push and render
    gl.drawArrays(gl.POINTS, 0, Particle.resolutionX * Particle.resolutionY);
  }
}

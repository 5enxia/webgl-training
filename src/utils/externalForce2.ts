import WebGL, { FboObject } from "./webgl";
import type { MousePosition } from "./renderer2";

import cvert from "../shaders/externalForce2/compute.vert?raw"
import cfrag from "../shaders/externalForce2/compute.frag?raw"

export default class ExternalForce {
  private constructor() {}

  // VBO生成
  public static position: number[] = []; // 頂点座標
  public static velocity: number[] = []; // 頂点のベクトル

  public static resolutionX = 512; // 頂点の配置解像度X
  public static resolutionY = 512; // 頂点の配置解像度Y
  public static intervalX = 1.0 / ExternalForce.resolutionX; // 頂点間の間隔X
  public static intervalY = 1.0 / ExternalForce.resolutionY; // 頂点間の間隔Y

  // VBO Array
  public static VBOArray: Array<WebGLBuffer | null>

  // Shader
  private static prg: WebGLProgram;
  public static attLocation: Array<number> = [];
  public static attStride: Array<number> = [];
  public static uniLocation: Array<WebGLUniformLocation | null> = [];

  // FBO
  public static fbo: FboObject | null;

  public static init(gl: WebGL2RenderingContext) {
    var vs = WebGL.createShaderFromSource(gl, cvert, "vert");
    var fs = WebGL.createShaderFromSource(gl, cfrag, "frag");
    if (!vs || !fs) return;
    var cprg = WebGL.createProgram(gl, vs, fs);
    if (!cprg) return;
    ExternalForce.prg = cprg;

    ExternalForce.attLocation = [0];
    ExternalForce.attStride = [2]

    ExternalForce.uniLocation = [
      gl.getUniformLocation(cprg, 'mouse'),
      gl.getUniformLocation(cprg, 'force'),
    ];

    for (let i = 0; i < ExternalForce.resolutionX; i++) {
      for (let j = 0; j < ExternalForce.resolutionY; j++) {
        // 頂点の座標
        let x = i * ExternalForce.intervalX * 2.0 - 1.0;
        let y = j * ExternalForce.intervalY * 2.0 - 1.0;

        ExternalForce.position.push(x, -y); // 頂点の座標
      }
    }

    // VBO Array
    ExternalForce.VBOArray = [
      WebGL.createVBO(gl, ExternalForce.position),
    ]

    ExternalForce.fbo = WebGL.createFramebuffer(gl, 512, 512);
  }

  // uniform 変数などを設定して描画処理を行い VBO に書き込む
  public static update(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement,mousePosition: MousePosition, mouseDiff: MousePosition) {
    gl.useProgram(ExternalForce.prg);

    if (!ExternalForce.fbo) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, ExternalForce.fbo.frameBuffer);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);


    WebGL.setAttributes(gl, ExternalForce.VBOArray, ExternalForce.attLocation, ExternalForce.attStride);

    gl.uniform2fv(ExternalForce.uniLocation[0], [mousePosition.x, mousePosition.y]);
    gl.uniform2fv(ExternalForce.uniLocation[1], [mouseDiff.x, mouseDiff.y]);
    gl.drawArrays(gl.POINTS, 0, ExternalForce.resolutionX * ExternalForce.resolutionY);

    // フレームバッファのバインドを解除
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}

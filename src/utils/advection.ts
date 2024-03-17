import WebGL, { FboObject } from "./webgl";

import cvert from "../shaders/advection/compute.vert?raw"
import cfrag from "../shaders/advection/compute.frag?raw"

export default class Advection {
  private constructor() {}

  // VBO生成
  public static position: number[] = []; // 頂点座標
  public static velocity: number[] = []; // 頂点のベクトル

  public static resolutionX = 512; // 頂点の配置解像度X
  public static resolutionY = 512; // 頂点の配置解像度Y
  public static intervalX = 1.0 / Advection.resolutionX; // 頂点間の間隔X
  public static intervalY = 1.0 / Advection.resolutionY; // 頂点間の間隔Y

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
    Advection.prg = cprg;

    Advection.attLocation = [0];
    Advection.attStride = [2]

    Advection.uniLocation = [
      gl.getUniformLocation(cprg, 'velocity'),
      gl.getUniformLocation(cprg, 'dt'),
    ];

    for (let i = 0; i < Advection.resolutionX; i++) {
      for (let j = 0; j < Advection.resolutionY; j++) {
        // 頂点の座標
        let x = i * Advection.intervalX * 2.0 - 1.0;
        let y = j * Advection.intervalY * 2.0 - 1.0;

        Advection.position.push(x, -y); // 頂点の座標
      }
    }

    // VBO Array
    Advection.VBOArray = [
      WebGL.createVBO(gl, Advection.position),
    ]

    Advection.fbo = WebGL.createFramebuffer(gl, 512, 512);
  }

  // uniform 変数などを設定して描画処理を行い VBO に書き込む
  public static update(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, fbo: FboObject) {
    gl.useProgram(Advection.prg);

    // テクスチャのバインド
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbo.fTexture);

    // フレームバッファのバインド
    if (!Advection.fbo) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, Advection.fbo.frameBuffer);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    WebGL.setAttributes(gl, Advection.VBOArray, Advection.attLocation, Advection.attStride);
    gl.uniform1i(Advection.uniLocation[0], 0); // uniform texture
    gl.uniform1f(Advection.uniLocation[1], 1 / 30); // uniform texture
    gl.drawArrays(gl.POINTS, 0, Advection.resolutionX * Advection.resolutionY);

    // フレームバッファのバインドを解除
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}

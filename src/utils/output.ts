import WebGL from "./webgl";

import vert from "../shaders/output/shader.vert?raw"
import frag from "../shaders/output/shader.frag?raw"

export default class Output {
  private constructor() {}

  // VBO生成
  public static position: number[] = []; // 頂点座標
  public static velocity: number[] = []; // 頂点のベクトル

  public static resolutionX = 512; // 頂点の配置解像度X
  public static resolutionY = 512; // 頂点の配置解像度Y
  public static intervalX = 1.0 / Output.resolutionX; // 頂点間の間隔X
  public static intervalY = 1.0 / Output.resolutionY; // 頂点間の間隔Y

  // VBO Array
  public static VBOArray: Array<WebGLBuffer | null>

  // Shader
  private static prg: WebGLProgram;
  public static attLocation: Array<number> = [];
  public static attStride: Array<number> = [];
  public static uniLocation: Array<WebGLUniformLocation | null> = [];

  public static init(gl: WebGL2RenderingContext) {
    var vs = WebGL.createShaderFromSource(gl, vert, "vert");
    var fs = WebGL.createShaderFromSource(gl, frag, "frag");
    if (!vs || !fs) return;
    var prg = WebGL.createProgram(gl, vs, fs);
    if (!prg) return;
    Output.prg = prg;

    // attribute
    Output.attLocation = [0];
    Output.attStride = [2]

    // uniform
    gl.activeTexture(gl.TEXTURE0);
    Output.uniLocation = [
      gl.getUniformLocation(prg, 'velocity'), // texture
    ];

    for (let i = 0; i < Output.resolutionX; i++) {
      for (let j = 0; j < Output.resolutionY; j++) {
        // 頂点の座標
        let x = i * Output.intervalX * 2.0 - 1.0;
        let y = j * Output.intervalY * 2.0 - 1.0;

        Output.position.push(x, -y); // 頂点の座標
      }
    }

    // VBO Array
    Output.VBOArray = [
      WebGL.createVBO(gl, Output.position),
    ]
  }

  public static draw(gl: WebGL2RenderingContext, texture: WebGLTexture | null) {
    // Clear
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, 512, 512);

    gl.useProgram(Output.prg);

    WebGL.setAttributes(gl, Output.VBOArray, Output.attLocation, Output.attStride);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(Output.uniLocation[0], 0);
    gl.drawArrays(gl.POINTS, 0, Output.resolutionX * Output.resolutionY);
  }
}

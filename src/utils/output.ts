import WebGL, { FboObject } from "./webgl";

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

  // IBO Array
  public static IBOArray: Array<WebGLBuffer | null>

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
    Output.uniLocation = [
      gl.getUniformLocation(prg, 'velocity'), // texture
    ];

    Output.position = [
      -1.0, 1.0,
      1.0, 1.0,
      -1.0, -1.0,
      1.0, -1.0,
    ]

    // VBO Array
    Output.VBOArray = [
      WebGL.createVBO(gl, Output.position),
    ]

    // IBO Array
    Output.IBOArray = [
      WebGL.createIBO(gl, [0, 2, 1, 1, 2, 3]),
    ]
  }

  public static draw(gl: WebGL2RenderingContext, fbo: FboObject) {
    gl.useProgram(Output.prg);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbo.fTexture);

    // Clear

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, 512, 512);

    WebGL.setAttributes(gl, Output.VBOArray, Output.attLocation, Output.attStride);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Output.IBOArray[0]);

    gl.uniform1i(Output.uniLocation[0], 0);
    // gl.drawArrays(gl.POINTS, 0, Output.resolutionX * Output.resolutionY);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    
    gl.flush();
  }
}

import WebGL, { FboObject } from "./webgl";

import vert from "../shaders/advection/compute.vert?raw"
import frag from "../shaders/advection/compute.frag?raw"
import Compute from "./compute";

export default class Advection extends Compute {
  private constructor() { 
    super()
  }

  // VBO生成
  public static velocity: number[] = []; // 頂点のベクトル

  // FBO
  public static src: FboObject;
  public static out: FboObject;

  public static init(gl: WebGL2RenderingContext, position: number[], src: FboObject, out: FboObject) {
    var prg = WebGL.createProgramFromSource(gl, vert, frag)
    if (!prg) return;
    Advection.prg = prg;

    Advection.attLocation = [0];
    Advection.attStride = [2]

    Advection.uniLocation = [
      gl.getUniformLocation(prg, 'velocity'),
      gl.getUniformLocation(prg, 'dt'),
    ];

    // VBO Array
    Advection.VBOArray = [
      WebGL.createVBO(gl, position),
    ]

    // IBO Array
    Advection.IBOArray = [
      WebGL.createIBO(gl, [0, 2, 1, 1, 2, 3]),
    ]

    Advection.src = src
    Advection.out = out
  }

  // uniform 変数などを設定して描画処理を行い VBO に書き込む
  public static update(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) {
    WebGL.clear(gl, canvas)

    gl.useProgram(Advection.prg);

    // テクスチャのバインド
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, Advection.src.fTexture);

    // フレームバッファのバインド
    gl.bindFramebuffer(gl.FRAMEBUFFER, Advection.out.frameBuffer);

    WebGL.setAttributes(gl, Advection.VBOArray, Advection.attLocation, Advection.attStride);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Advection.IBOArray[0]);

    gl.uniform1i(Advection.uniLocation[0], 0); // uniform texture
    gl.uniform1f(Advection.uniLocation[1], 1 / 60); // uniform texture
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // フレームバッファのバインドを解除
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}

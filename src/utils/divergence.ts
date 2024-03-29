import WebGL, { FboObject } from "./webgl";

import vert from "../shaders/divergence/compute.vert?raw"
import frag from "../shaders/divergence/compute.frag?raw"
import Compute from "./compute";

export default class Divergence extends Compute {
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
    Divergence.prg = prg;

    Divergence.attLocation = [0];
    Divergence.attStride = [2]

    Divergence.uniLocation = [
      gl.getUniformLocation(prg, 'velocity'),
      gl.getUniformLocation(prg, 'dt'),
    ];

    // VBO Array
    Divergence.VBOArray = [
      WebGL.createVBO(gl, position),
    ]

    // IBO Array
    Divergence.IBOArray = [
      WebGL.createIBO(gl, [0, 2, 1, 1, 2, 3]),
    ]

    Divergence.src = src
    Divergence.out = out
  }

  // uniform 変数などを設定して描画処理を行い VBO に書き込む
  public static update(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) {
    WebGL.clear(gl, canvas)

    gl.useProgram(Divergence.prg);

    // テクスチャのバインド
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, Divergence.src.fTexture);

    // フレームバッファのバインド
    gl.bindFramebuffer(gl.FRAMEBUFFER, Divergence.out.frameBuffer);

    WebGL.setAttributes(gl, Divergence.VBOArray, Divergence.attLocation, Divergence.attStride);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Divergence.IBOArray[0]);
    gl.uniform1i(Divergence.uniLocation[0], 0); // uniform texture
    gl.uniform1f(Divergence.uniLocation[1], 1 / 60); // uniform texture
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // フレームバッファのバインドを解除
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}

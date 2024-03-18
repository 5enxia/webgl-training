import WebGL, { FboObject } from "./webgl";

import vert from "../shaders/pressure/compute.vert?raw"
import frag from "../shaders/pressure/compute.frag?raw"
import Compute from "./compute";

export default class Pressure extends Compute {
  private constructor() { 
    super()
  }

  // VBO生成
  public static velocity: number[] = []; // 頂点のベクトル

  // FBO
  public static srcV: FboObject;
  public static srcP: FboObject;
  public static out: FboObject;

  public static init(gl: WebGL2RenderingContext, position: number[], srcV: FboObject, srcP: FboObject, out: FboObject) {
    var prg = WebGL.createProgramFromSource(gl, vert, frag)
    if (!prg) return;
    Pressure.prg = prg;

    Pressure.attLocation = [0];
    Pressure.attStride = [2]

    Pressure.uniLocation = [
      gl.getUniformLocation(prg, 'velocity'),
      gl.getUniformLocation(prg, 'pressure'),
    ];

    // VBO Array
    Pressure.VBOArray = [
      WebGL.createVBO(gl, position),
    ]

    // IBO Array
    Pressure.IBOArray = [
      WebGL.createIBO(gl, [0, 2, 1, 1, 2, 3]),
    ]

    Pressure.srcV = srcV
    Pressure.srcP = srcP
    Pressure.out = out
  }

  // uniform 変数などを設定して描画処理を行い VBO に書き込む
  public static update(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) {
      WebGL.clear(gl, canvas)

      gl.useProgram(Pressure.prg);

      // テクスチャのバインド
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.srcV.fTexture);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.srcP.fTexture);

      // フレームバッファのバインド
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.out.frameBuffer);

      WebGL.setAttributes(gl, Pressure.VBOArray, Pressure.attLocation, Pressure.attStride);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Pressure.IBOArray[0]);
      gl.uniform1i(Pressure.uniLocation[0], 0); // uniform texture
      gl.uniform1i(Pressure.uniLocation[1], 1); // uniform texture
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

      // フレームバッファのバインドを解除
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}

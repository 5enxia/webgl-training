import WebGL, { FboObject } from "./webgl";

import vert from "../shaders/poisson/compute.vert?raw"
import frag from "../shaders/poisson/compute.frag?raw"
import Compute from "./compute";

export default class Poisson extends Compute {
  private constructor() { 
    super()
  }

  // VBO生成
  public static velocity: number[] = []; // 頂点のベクトル

  // FBO
  public static src: FboObject;
  public static out0: FboObject;
  public static out1: FboObject;

  public static init(gl: WebGL2RenderingContext, position: number[], src: FboObject, out0: FboObject, out1: FboObject) {
    var prg = WebGL.createProgramFromSource(gl, vert, frag)
    if (!prg) return;
    Poisson.prg = prg;

    Poisson.attLocation = [0];
    Poisson.attStride = [2]

    Poisson.uniLocation = [
      gl.getUniformLocation(prg, 'pressure'),
      gl.getUniformLocation(prg, 'divergence'),
    ];

    // VBO Array
    Poisson.VBOArray = [
      WebGL.createVBO(gl, position),
    ]

    // IBO Array
    Poisson.IBOArray = [
      WebGL.createIBO(gl, [0, 2, 1, 1, 2, 3]),
    ]

    Poisson.src = src
    Poisson.out0 = out0
    Poisson.out1 = out1
  }

  // uniform 変数などを設定して描画処理を行い VBO に書き込む
  public static update(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) {
    let p_in, p_out;

    for(var i = 0; i < 10; i++) {
      if (i % 2 == 0) {
        p_in = Poisson.out0;
        p_out = Poisson.out1;
      }
      else {
        p_in = Poisson.out1;
        p_out = Poisson.out0;
      }

      WebGL.clear(gl, canvas)

      gl.useProgram(Poisson.prg);

      // テクスチャのバインド
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, p_in.fTexture);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.src.fTexture);

      // フレームバッファのバインド
      gl.bindFramebuffer(gl.FRAMEBUFFER, p_out.frameBuffer);

      WebGL.setAttributes(gl, Poisson.VBOArray, Poisson.attLocation, Poisson.attStride);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Poisson.IBOArray[0]);
      gl.uniform1i(Poisson.uniLocation[0], 0); // uniform texture
      gl.uniform1i(Poisson.uniLocation[1], 1); // uniform texture
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

      // フレームバッファのバインドを解除
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
  }
}

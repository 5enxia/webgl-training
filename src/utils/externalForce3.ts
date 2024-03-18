import WebGL, { FboObject } from "./webgl";
import type { MousePosition } from "./renderer2";

import vert from "../shaders/externalForce2/compute.vert?raw"
import frag from "../shaders/externalForce2/compute.frag?raw"
import { Resolution } from "./simulation";
import Compute from "./compute";

export default class ExternalForce extends Compute {
  private constructor() {
    super()
  }

  // VBO生成
  public static velocity: number[] = []; // 頂点のベクトル

  // FBO
  public static src: FboObject;
  public static out: FboObject;

  public static init(gl: WebGL2RenderingContext, position: number[], resolution: Resolution, src: FboObject, out: FboObject) {
    let prg = WebGL.createProgramFromSource(gl, vert, frag);
    if (!prg) return;
    ExternalForce.prg = prg;

    // attribute
    ExternalForce.attLocation = [0];
    ExternalForce.attStride = [2]

    // uniform
    ExternalForce.uniLocation = [
      gl.getUniformLocation(ExternalForce.prg, 'mouse'),
      gl.getUniformLocation(ExternalForce.prg, 'force'),
      gl.getUniformLocation(ExternalForce.prg, 'velocity'),
    ];

    // VBO
    ExternalForce.resolution = resolution;
    ExternalForce.VBOArray = [
      WebGL.createVBO(gl, position),
    ]

    // IBO
    ExternalForce.IBOArray = [
      WebGL.createIBO(gl, [0, 2, 1, 1, 2, 3]),
    ]

    // FBO
    ExternalForce.src = src
    ExternalForce.out = out
  }

  // uniform 変数などを設定して描画処理を行い VBO に書き込む
  public static update(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, mousePosition: MousePosition, mouseDiff: MousePosition) {
    WebGL.clear(gl, canvas)

    // シェーダーを設定
    gl.useProgram(ExternalForce.prg);

    // テクスチャのバインド
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, ExternalForce.src.fTexture);

    // フレームバッファのバインド
    gl.bindFramebuffer(gl.FRAMEBUFFER, ExternalForce.out.frameBuffer);

    // attribute
    WebGL.setAttributes(gl, ExternalForce.VBOArray, ExternalForce.attLocation, ExternalForce.attStride);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ExternalForce.IBOArray[0]);

    // uniform
    gl.uniform2fv(ExternalForce.uniLocation[0], [mousePosition.x, mousePosition.y]);
    gl.uniform2fv(ExternalForce.uniLocation[1], [mouseDiff.x, mouseDiff.y]);
    gl.uniform1i(ExternalForce.uniLocation[2], 0); // uniform texture

    // draw
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // フレームバッファのバインドを解除
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}

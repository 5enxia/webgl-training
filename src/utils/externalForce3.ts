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

  public static init(gl: WebGL2RenderingContext, position: number[], resolution: Resolution) {
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
    ];

    // VBO
    ExternalForce.resolution = resolution;
    ExternalForce.VBOArray = [
      WebGL.createVBO(gl, position),
    ]
  }

  // uniform 変数などを設定して描画処理を行い VBO に書き込む
  public static update(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, mousePosition: MousePosition, mouseDiff: MousePosition, fbo: FboObject) {
    WebGL.clear(gl, canvas)

    // シェーダーを設定
    gl.useProgram(ExternalForce.prg);

    // フレームバッファのバインド
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.frameBuffer);

    // attribute
    WebGL.setAttributes(gl, ExternalForce.VBOArray, ExternalForce.attLocation, ExternalForce.attStride);

    // uniform
    gl.uniform2fv(ExternalForce.uniLocation[0], [mousePosition.x, mousePosition.y]);
    gl.uniform2fv(ExternalForce.uniLocation[1], [mouseDiff.x, mouseDiff.y]);

    // draw
    gl.drawArrays(gl.POINTS, 0, ExternalForce.resolution.x * ExternalForce.resolution.y);

    // フレームバッファのバインドを解除
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}

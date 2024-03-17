import Advection from "./advection";
import ExternalForce from "./externalForce3";
import { MousePosition } from "./renderer5";
import WebGL, { FboObject } from "./webgl";

export interface Resolution {
    x: number;
    y: number;
}

export interface Interval {
    x: number;
    y: number;
}

export default class Simulation {
  private constructor() {}

  // VBO生成
  public static position: number[] = []; // 頂点座標

  public static resolution: Resolution = { x: 512, y: 512 }; // 頂点の配置解像度
  public static interval: Interval = {
    x: 1.0 / Simulation.resolution.x,
    y: 1.0 / Simulation.resolution.y,
  }; // 頂点間の間隔

  // fbo
  public static externalforce0: FboObject | null
  public static advection0: FboObject | null

  public static init(gl: WebGL2RenderingContext) {
    for (let i = 0; i < Simulation.resolution.x; i++) {
      for (let j = 0; j < Simulation.resolution.y; j++) {
        // 頂点の座標
        let x = i * Simulation.interval.x * 2.0 - 1.0;
        let y = j * Simulation.interval.y * 2.0 - 1.0;

        Simulation.position.push(x, -y); // 頂点の座標
      }
    }

    Simulation.externalforce0 = WebGL.createFramebuffer(gl, this.resolution.x, this.resolution.y)
    Simulation.advection0 = WebGL.createFramebuffer(gl, this.resolution.x, this.resolution.y)

    ExternalForce.init(gl, Simulation.position, Simulation.resolution)
    Advection.init(gl)
  }

  public static update(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, mousePosition: MousePosition, mouseDiff: MousePosition) {
    if (!Simulation.externalforce0) return
    ExternalForce.update(gl, canvas, mousePosition, mouseDiff, Simulation.externalforce0);
    if (!Simulation.advection0) return
    Advection.update(gl, canvas, Simulation.externalforce0)
  }
}

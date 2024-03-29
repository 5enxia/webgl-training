import Advection from "./advection2";
import Divergence from "./divergence";
import ExternalForce from "./externalForce3";
import Poisson from "./poisson";
import Pressure from "./pressure";
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
  public static vel0: FboObject | null
  public static vel1: FboObject | null
  public static vel2: FboObject | null
  public static div: FboObject | null
  public static p0: FboObject | null
  public static p1: FboObject | null

  public static init(gl: WebGL2RenderingContext) {
    // for (let i = 0; i < Simulation.resolution.x; i++) {
    //   for (let j = 0; j < Simulation.resolution.y; j++) {
    //     // 頂点の座標
    //     let x = i * Simulation.interval.x * 2.0 - 1.0;
    //     let y = j * Simulation.interval.y * 2.0 - 1.0;

    //     Simulation.position.push(x, -y); // 頂点の座標
    //   }
    // }
    Simulation.position = [
      -1.0, 1.0,
      1.0, 1.0,
      -1.0, -1.0,
      1.0, -1.0,
    ]

    Simulation.vel0 = WebGL.createFramebuffer(gl, this.resolution.x, this.resolution.y)
    Simulation.vel1 = WebGL.createFramebuffer(gl, this.resolution.x, this.resolution.y)
    Simulation.vel2 = WebGL.createFramebuffer(gl, this.resolution.x, this.resolution.y)
    Simulation.div = WebGL.createFramebuffer(gl, this.resolution.x, this.resolution.y)
    Simulation.p0 = WebGL.createFramebuffer(gl, this.resolution.x, this.resolution.y)
    Simulation.p1 = WebGL.createFramebuffer(gl, this.resolution.x, this.resolution.y)

    if (!Simulation.vel0 || !Simulation.vel1 || !Simulation.div || !Simulation.p0 || !Simulation.p1 || !Simulation.vel2) return
    Advection.init(gl, this.position, Simulation.vel0, Simulation.vel1)
    ExternalForce.init(gl, Simulation.position, Simulation.resolution, Simulation.vel1, Simulation.vel2)
    Divergence.init(gl, this.position, Simulation.vel1, Simulation.div)
    Poisson.init(gl, this.position, Simulation.div, Simulation.p0, Simulation.p1)
    Pressure.init(gl, this.position, Simulation.vel2, Simulation.p0, Simulation.vel0)
  }

  public static update(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, mousePosition: MousePosition, mouseDiff: MousePosition) {
    Advection.update(gl, canvas)
    ExternalForce.update(gl, canvas, mousePosition, mouseDiff);
    Divergence.update(gl, canvas)
    Poisson.update(gl, canvas)
    Pressure.update(gl, canvas)
  }
}

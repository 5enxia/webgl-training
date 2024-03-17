import WebGL from "./webgl";

import ExternalForce from "./externalForce2";
import Output from "./output";

export interface MousePosition {
  x: number;
  y: number;
}

export default class Renderer {
  private constructor() {}

  // context
  public static canvas: HTMLCanvasElement;
  public static gl: WebGL2RenderingContext;

  // params
  public static startTime: number = 0;
  public static FPS = 10;
  public static time = 0;
  public static counter = 0;

  // mouse
  public static mousePosition: MousePosition = { x: 0, y: 0 };
  public static preMousePosition: MousePosition = { x: 0, y: 0 };
  public static mouseFlag = false;

  // 初期化
  public static init(canvas: HTMLCanvasElement) {
    // Context
    Renderer.canvas = canvas;
    const gl = WebGL.createContext(canvas);
    if (!gl) return;
    Renderer.gl = gl;

    // Flags
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);

    // Events
    canvas.addEventListener("mousemove", Renderer.mousemove);
    canvas.addEventListener("mousedown", Renderer.mousedown);
    canvas.addEventListener("mouseup", Renderer.mouseup);

    // Simulation
    // 外力
    ExternalForce.init(gl);

    // 描画
    Output.init(gl);

    // Time
    Renderer.startTime = new Date().getTime();

    // Start animation
    Renderer.animate();
  }

  public static animate() {
    Renderer.update();
    Renderer.draw();

    setTimeout(Renderer.animate, 1 / Renderer.FPS);
  }

  private static update() {
    const canvas = Renderer.canvas;
    const gl = Renderer.gl;

    // Simulation
    // 外力
    ExternalForce.update(gl, canvas, Renderer.mousePosition, Renderer.mouseFlag);

    // Counter
    Renderer.counter++;

    // Time
    Renderer.time = new Date().getTime() - Renderer.startTime; 
  }

  private static draw() {
    const gl = Renderer.gl;

    // Simulation
    if (!ExternalForce.fbo) { return }
    Output.draw(gl, ExternalForce.fbo.fTexture);
  }

  private static mousemove(e: MouseEvent) {
    // clone previous mouse position
    Renderer.preMousePosition = structuredClone(Renderer.mousePosition);
    Renderer.mousePosition = {
        x: e.offsetX / Renderer.canvas.width * 2 - 1,
        y: e.offsetY / Renderer.canvas.height * -2 + 1,
    }
  }

  private static mousedown(e: MouseEvent) {
    Renderer.mouseFlag = true
  }

  private static mouseup(e: MouseEvent) {
    Renderer.mouseFlag = false
  }
}

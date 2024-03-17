import WebGL from "./webgl";

import Output from "./output";
import Simulation from "./simulation";

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
  public static FPS = 30;
  public static time = 0;
  public static counter = 0;

  // mouse
  public static mousePosition: MousePosition = { x: 0, y: 0 };
  public static preMousePosition: MousePosition = { x: 0, y: 0 };
  public static mouseDiff: MousePosition = { x: 0, y: 0 };
  public static mouseFlag = false;

  // 初期化
  public static init(canvas: HTMLCanvasElement) {
    // Context
    Renderer.canvas = canvas;
    const gl = WebGL.createContext(canvas);
    // gl.Floatを有効化
    if (!gl) return;
      // float texture を有効化 (webgl2)
    if (!gl.getExtension("EXT_color_buffer_float")) {
      alert("float texture not supported");
    }
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
    Simulation.init(gl)

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
    Simulation.update(gl, canvas, this.mousePosition, this.mouseDiff)

    // Counter
    Renderer.counter++;

    // Time
    Renderer.time = new Date().getTime() - Renderer.startTime; 
  }

  private static draw() {
    const gl = Renderer.gl;
    if (!Simulation.externalforce0) return
    Output.draw(gl, Simulation.externalforce0);
  }

  private static mousemove(e: MouseEvent) {
    // clone previous mouse position
    Renderer.preMousePosition = structuredClone(Renderer.mousePosition);
    Renderer.mousePosition = {
        x: e.offsetX / Renderer.canvas.width * 2 - 1,
        y: e.offsetY / Renderer.canvas.height * -2 + 1,
    }
    Renderer.mouseDiff = {
      x: Renderer.mousePosition.x - Renderer.preMousePosition.x,
      y: Renderer.mousePosition.y - Renderer.preMousePosition.y,
    }
  }

  private static mousedown(e: MouseEvent) {
    Renderer.mouseFlag = true
  }

  private static mouseup(e: MouseEvent) {
    Renderer.mouseFlag = false
  }
}

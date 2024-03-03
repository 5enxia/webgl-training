import WebGL from "./webgl";

import vert from "../assets/mouse/shader.vert?raw"
import frag from "../assets/mouse/shader.frag?raw"

interface MousePosition {
  x: number;
  y: number;
}

export default class Renderer {
  private constructor() {}

  // context
  public static canvas: HTMLCanvasElement;
  public static gl: WebGL2RenderingContext;

  // params
  public static uniLocations: Array<WebGLUniformLocation | null> = [];
  public static startTime: number = 0;
  public static FPS = 30;
  public static time = 0;

  // mouse
  public static mousePosition: MousePosition = { x: 0, y: 0 };
  public static mouseFlag = false;

  // 初期化
  public static init(canvas: HTMLCanvasElement) {
    // Context
    Renderer.canvas = canvas;
    const gl = WebGL.createContext(canvas);
    if (!gl) return;
    Renderer.gl = gl;

    // Enable blending
    Renderer.gl.enable(Renderer.gl.BLEND);

    // Shader
    const vs = WebGL.createShaderFromSource(gl, vert, "vert");
    const fs = WebGL.createShaderFromSource(gl, frag, "frag");
    if (!vs || !fs) return;
    var prg = WebGL.createProgram(gl, vs, fs);
    if (!prg) return;

    // Uniform
    Renderer.uniLocations[0] = gl.getUniformLocation(prg, "time");
    Renderer.uniLocations[1] = gl.getUniformLocation(prg, "mouse");
    Renderer.uniLocations[2] = gl.getUniformLocation(prg, "resolution");

    // Attribute
    WebGL.createPlane(gl, prg);

    // Time
    Renderer.startTime = new Date().getTime();

    // Events
    Renderer.canvas.addEventListener("mousemove", Renderer.mousemove);
    Renderer.canvas.addEventListener("mousedown", Renderer.mousedown);
    Renderer.canvas.addEventListener("mouseleave", Renderer.mouseleave);

    // Start animation
    Renderer.animate();
  }

  public static animate() {
    Renderer.update();
    Renderer.draw();

    setTimeout(Renderer.animate, 1 / Renderer.FPS);
  }

  private static update() {
    // Time
    Renderer.time = new Date().getTime() - Renderer.startTime; 
  }

  private static draw() {
    const gl = Renderer.gl;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(Renderer.uniLocations[0], Renderer.time);
    gl.uniform2fv(Renderer.uniLocations[1], [Renderer.mousePosition.x, Renderer.mousePosition.y]);
    gl.uniform2fv(Renderer.uniLocations[2], [Renderer.canvas.width, Renderer.canvas.height]);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.flush();
  }

  private static mousemove(e: MouseEvent) {
    Renderer.mousePosition = {
        x: e.offsetX / Renderer.canvas.width,
        y: e.offsetY / Renderer.canvas.height,
    }
  }

  private static mousedown(e: MouseEvent) {
    Renderer.mouseFlag = true
  }

  private static mouseleave(e: MouseEvent) {
    Renderer.mouseFlag = false
  }
}

import WebGL from "./webgl";

import vert from "../assets/shader.vert?raw"
import frag from "../assets/shader.frag?raw"

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

  // 初期化
  public static init(canvas: HTMLCanvasElement) {
    // Context
    Renderer.canvas = canvas;
    const gl = WebGL.createContext(canvas);
    if (!gl) return;
    Renderer.gl = gl;

    const vs = WebGL.createShaderFromSource(gl, vert, "vert");
    const fs = WebGL.createShaderFromSource(gl, frag, "frag");
    if (!vs || !fs) return;
    var prg = WebGL.createProgram(gl, vs, fs);
    if (!prg) return;

    Renderer.uniLocations[0] = gl.getUniformLocation(prg, "time");
    Renderer.uniLocations[1] = gl.getUniformLocation(prg, "mouse");
    Renderer.uniLocations[2] = gl.getUniformLocation(prg, "resolution");

    // 頂点データ
    const position = [
      -1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0,
    ];
    // 頂点インデックス
    const index = [0, 2, 1, 1, 2, 3];
    var vPosition = WebGL.createVBO(gl, position);
    if (!vPosition) return;
    var vIndex = WebGL.createIBO(gl, index);
    if (!vIndex) return;
    var vAttLocation = gl.getAttribLocation(prg, "position");
    gl.bindBuffer(gl.ARRAY_BUFFER, vPosition);
    gl.enableVertexAttribArray(vAttLocation);
    gl.vertexAttribPointer(vAttLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);

    Renderer.startTime = new Date().getTime();

    // Events
    Renderer.canvas.addEventListener("mousemove", Renderer.mouseMove);

    // Start animation
    Renderer.animate();
  }

  public static animate() {
    Renderer.update();
    Renderer.draw();

    setTimeout(Renderer.animate, 1 / Renderer.FPS);
  }

  private static update() {
    const now = new Date();
    Renderer.time = now.getTime() - Renderer.startTime; 
  }

  private static draw() {
    const gl = Renderer.gl;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(Renderer.uniLocations[0], Renderer.time);
    gl.uniform2fv(Renderer.uniLocations[1], [Renderer.mousePosition.x, Renderer.mousePosition.y]);
    gl.uniform2fv(Renderer.uniLocations[2], [
      Renderer.canvas?.width ?? 0,
      Renderer.canvas?.height ?? 0,
    ]);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.flush();
  }

  private static mouseMove(e: MouseEvent) {
    Renderer.mousePosition = {
        x: e.offsetX / Renderer.canvas.width,
        y: e.offsetY / Renderer.canvas.height,
    }
  }
}

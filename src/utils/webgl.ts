export default class WebGL {
  // singleton
  private constructor() {}
  //   public static canvas: HTMLCanvasElement | null = null;
  //   public static gl: WebGL2RenderingContext | null = null;
  //   public static shaders: Map<string, WebGLShader> = new Map();
  //   public static programs: Map<string, WebGLProgram> = new Map();
  //   public static vbos: Map<string, WebGLBuffer> = new Map();

  public static getCanvas(id: string): HTMLCanvasElement | null {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    canvas.width = 512;
    canvas.height = 512;
    return canvas;
  }

  public static createContext(
    canvas: HTMLCanvasElement
  ): WebGL2RenderingContext | undefined {
    const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return gl;
  }

  public static createShader(
    gl: WebGL2RenderingContext,
    id: string
  ): WebGLShader | undefined {
    const scriptElement = document.getElementById(id) as HTMLScriptElement;
    if (!scriptElement || !(scriptElement instanceof HTMLScriptElement)) {
      return;
    }

    var shader: WebGLShader | null = null;
    switch (scriptElement.type) {
      case "x-shader/x-vertex":
        shader = gl.createShader(gl.VERTEX_SHADER);
        break;
      case "x-shader/x-fragment":
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        break;
      default:
        return;
    }
    if (!shader) {
      return;
    }
    gl.shaderSource(shader, scriptElement.text);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      alert(gl.getShaderInfoLog(shader));
    }
  }

  public static createShaderFromSource(
    gl: WebGL2RenderingContext,
    source: string,
    type: "vert" | "frag"
  ): WebGLShader | undefined {
    var shader: WebGLShader | null = null;
    switch (type) {
      case "vert":
        shader = gl.createShader(gl.VERTEX_SHADER);
        break;
      case "frag":
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        break;
      default:
        return;
    }
    if (!shader) {
      return;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      alert(gl.getShaderInfoLog(shader));
    }
  }

  public static createProgram(
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram | undefined {
    var program = gl.createProgram();
    if (!program) {
      return;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      return program;
    } else {
      alert(gl.getProgramInfoLog(program));
    }
  }

  public static createVBO(
    gl: WebGL2RenderingContext,
    data: number[]
  ): WebGLBuffer | undefined {
    var vbo = gl.createBuffer();
    if (!vbo) {
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  }

  public static createIBO(
    gl: WebGL2RenderingContext,
    data: number[]
  ): WebGLBuffer | undefined {
    var ibo = gl.createBuffer();
    if (!ibo) {
      return;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Int16Array(data),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
  }
}

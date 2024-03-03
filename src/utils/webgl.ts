export default class WebGL {
  private constructor() {}

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

  public static createPlane(gl: WebGL2RenderingContext, prg: WebGLProgram) {
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
  }

  public static createParticle(gl: WebGL2RenderingContext, prg: WebGLProgram, position: number[]): Float32Array {
    var pAttLocation = gl.getAttribLocation(prg, "position");

    var pointPosition = new Float32Array(position);
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.enableVertexAttribArray(pAttLocation);
    gl.vertexAttribPointer(pAttLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, pointPosition, gl.DYNAMIC_DRAW);
    return pointPosition;
  }
}

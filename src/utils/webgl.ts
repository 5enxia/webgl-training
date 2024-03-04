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
  ): WebGL2RenderingContext | null {
    const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return gl;
  }

  public static createShader(
    gl: WebGL2RenderingContext,
    id: string
  ): WebGLShader | null {
    const scriptElement = document.getElementById(id) as HTMLScriptElement;
    if (!scriptElement || !(scriptElement instanceof HTMLScriptElement)) {
      return null;
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
        return null;
    }
    if (!shader) {
      return null;
    }
    gl.shaderSource(shader, scriptElement.text);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }
  }

  public static createShaderFromSource(
    gl: WebGL2RenderingContext,
    source: string,
    type: "vert" | "frag"
  ): WebGLShader | null {
    var shader: WebGLShader | null = null;
    switch (type) {
      case "vert":
        shader = gl.createShader(gl.VERTEX_SHADER);
        break;
      case "frag":
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        break;
      default:
        return null;
    }
    if (!shader) {
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }
  }

  public static createProgram(
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram | null {
    var program = gl.createProgram();
    if (!program) {
      return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      return program;
    } else {
      alert(gl.getProgramInfoLog(program));
      return null;
    }
  }

  public static createTransformFeedbackProgram(
    gl: WebGL2RenderingContext,
    vs: WebGLShader,
    fs: WebGLShader,
    varyings: Iterable<string>
  ) {
    var prg = gl.createProgram();
    if (!prg) {
      return null;
    }
    gl.attachShader(prg, vs);
    gl.attachShader(prg, fs);
    gl.transformFeedbackVaryings(prg, varyings, gl.SEPARATE_ATTRIBS);
    gl.linkProgram(prg);
    if (gl.getProgramParameter(prg, gl.LINK_STATUS)) {
      gl.useProgram(prg);
      return prg;
    } else {
      alert(gl.getProgramInfoLog(prg));
    }
  }

  public static createVBO(
    gl: WebGL2RenderingContext,
    data: number[]
  ): WebGLBuffer | null {
    var vbo = gl.createBuffer();
    if (!vbo) {
      return null;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  }

  public static createTransformFeedbackVBO(
    gl: WebGL2RenderingContext,
    data: number[]
  ): WebGLBuffer | null {
    var vbo = gl.createBuffer();
    if (!vbo) {
      return null;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_COPY);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  }

  public static createIBO(
    gl: WebGL2RenderingContext,
    data: number[]
  ): WebGLBuffer | null {
    var ibo = gl.createBuffer();
    if (!ibo) {
      return null;
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
    if (!vPosition) return null;
    var vIndex = WebGL.createIBO(gl, index);
    if (!vIndex) return null;
    var vAttLocation = gl.getAttribLocation(prg, "position");
    gl.bindBuffer(gl.ARRAY_BUFFER, vPosition);
    gl.enableVertexAttribArray(vAttLocation);
    gl.vertexAttribPointer(vAttLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);
  }

  public static createParticle(
    gl: WebGL2RenderingContext,
    prg: WebGLProgram,
    position: number[]
  ): Float32Array {
    var pAttLocation = gl.getAttribLocation(prg, "position");

    var pointPosition = new Float32Array(position);
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.enableVertexAttribArray(pAttLocation);
    gl.vertexAttribPointer(pAttLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, pointPosition, gl.DYNAMIC_DRAW);
    return pointPosition;
  }

  public static setAttribute(
    gl: WebGL2RenderingContext,
    vbo: WebGLBuffer,
    attL: number,
    attS: number
  ) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.enableVertexAttribArray(attL);
    gl.vertexAttribPointer(attL, attS, gl.FLOAT, false, 0, 0);
  }

  public static setAttributes(
    gl: WebGL2RenderingContext,
    vbos: Array<WebGLBuffer | null>,
    attLs: number[],
    attSs: number[]
  ) {
    for (let i in vbos) {
      if (vbos[i] == null) continue;
      let vbo = vbos[i] as WebGLBuffer;
      WebGL.setAttribute(gl, vbo, attLs[i], attSs[i]);
    }
  }
}

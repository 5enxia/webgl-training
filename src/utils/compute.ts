import { Resolution } from "./simulation";

export default abstract class Compute {
    constructor() {}

    public static resolution: Resolution = { x: 512, y: 512 }; // 頂点の配置解像度 

    // VBO Array
    public static VBOArray: Array<WebGLBuffer | null>
    
    // IBO Array
    public static IBOArray: Array<WebGLBuffer | null>

    // Shader
    public static prg: WebGLProgram;
    public static attLocation: Array<number> = [];
    public static attStride: Array<number> = [];
    public static uniLocation: Array<WebGLUniformLocation | null> = [];
}
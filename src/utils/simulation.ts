export default class Simulation {
    public static gl: WebGL2RenderingContext;
    public static w: number;
    public static h: number;
    public static scale: number;

    // 速度
    public static velocity0: number[][];
    public static velocity1: number[][];

    // viscos
    public static viscos0: number[][];
    public static viscos1: number[][];

    // divergence
    public static divergence: number[][];

    // pressure
    public static pressure0: number[][];
    public static pressure1: number[][];

    public static init(gl: WebGL2RenderingContext, w: number, h: number) {
        // gridを初期化
        Simulation.velocity0 = [];
        Simulation.velocity1 = [];
        Simulation.viscos0 = [];
        Simulation.viscos1 = [];
        Simulation.divergence = [];
        Simulation.pressure0 = [];
        Simulation.pressure1 = [];

        for (let i = 0; i < w; i++) {
            Simulation.velocity0[i] = [];
            Simulation.velocity1[i] = [];
            Simulation.viscos0[i] = [];
            Simulation.viscos1[i] = [];
            Simulation.divergence[i] = [];
            Simulation.pressure0[i] = [];
            Simulation.pressure1[i] = [];
            for (let j = 0; j < h; j++) {
                Simulation.velocity0[i][j] = 0;
                Simulation.velocity1[i][j] = 0;
                Simulation.viscos0[i][j] = 0;
                Simulation.viscos1[i][j] = 0;
                Simulation.divergence[i][j] = 0;
                Simulation.pressure0[i][j] = 0;
                Simulation.pressure1[i][j] = 0;
            }
        }
    }

    public static update(gl: WebGL2RenderingContext) {
    }

    public static draw(gl: WebGL2RenderingContext) {
    }   
}
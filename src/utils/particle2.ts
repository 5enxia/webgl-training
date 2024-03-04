export default class Particle {
  private constructor() {}

  // VBO生成
  public static position: number[] = []; // 頂点座標
  public static velocity: number[] = []; // 頂点のベクトル
  public static color: number[] = []; // 頂点の色
  
  public static resolutionX = 100; // 頂点の配置解像度X
  public static resolutionY = 100; // 頂点の配置解像度Y
  public static intervalX = 1.0 / Particle.resolutionX; // 頂点間の間隔X
  public static intervalY = 1.0 / Particle.resolutionY; // 頂点間の間隔Y

  // VBO Array
  public static VBOArray: number[][] = []

  public static init() {
    for (let i = 0; i < Particle.resolutionX; i++) {
      for (let j = 0; j < Particle.resolutionY; j++) {
        // 頂点の座標
        let x = i * Particle.intervalX * 2.0 - 1.0;
        let y = j * Particle.intervalY * 2.0 - 1.0;

        Particle.position.push(x, -y, 0); // 頂点の座標
        let m = Math.sqrt(x * x + y * y);
        Particle.velocity.push(x / m, -y / m, 0); // 頂点のベクトル
        Particle.color.push(1.0, 1.0, 1.0, 1.0); // 頂点の色
      }
    }
  }
}

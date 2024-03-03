export default class Particle {
  private constructor() {}

  // VBO生成
  public static position: number[] = []; // 頂点座標
  public static vector: number[] = []; // 頂点の進行方向ベクトル
  public static resolutionX = 100; // 頂点の配置解像度X
  public static resolutionY = 100; // 頂点の配置解像度Y
  public static intervalX = 1.0 / Particle.resolutionX; // 頂点間の間隔X
  public static intervalY = 1.0 / Particle.resolutionY; // 頂点間の間隔Y
  public static verticesCount = Particle.resolutionX * Particle.resolutionY; // 頂点の個数

  public static pointPosition: Float32Array;

  public static SPEED = 0.1; // 速度
  public static velocity = 0.1; // 速度

  public static init() {
    for (let i = 0; i < Particle.resolutionX; i++) {
      for (let j = 0; j < Particle.resolutionY; j++) {
        // 頂点の座標
        let x = i * Particle.intervalX * 2.0 - 1.0;
        let y = j * Particle.intervalY * 2.0 - 1.0;
        Particle.position.push(x, y); // 頂点の座標
        Particle.vector.push(0.0, 0.0); // 頂点のベクトル
      }
    }
  }

  public static update(
    mouseFlag: boolean,
    mousePositionX: number,
    mousePositionY: number
  ) {
    // 点を更新する
    for (let i = 0; i < Particle.resolutionX; i++) {
      let k = i * Particle.resolutionX;
      for (let j = 0; j < Particle.resolutionY; j++) {
        let l = (k + j) * 2;
        // マウスフラグを見てベクトルを更新する
        if (mouseFlag) {
          Particle.velocity = 1.;
        } else {
          Particle.velocity *= 0.95;
        }
        var p = Particle.vectorUpdate(
          Particle.pointPosition[l],
          Particle.pointPosition[l + 1],
          mousePositionX,
          mousePositionY,
          Particle.vector[l],
          Particle.vector[l + 1]
        );
        Particle.vector[l] = p[0];
        Particle.vector[l + 1] = p[1];
        Particle.pointPosition[l] +=
          Particle.vector[l] * Particle.velocity * Particle.SPEED;
        Particle.pointPosition[l + 1] +=
          Particle.vector[l + 1] * Particle.velocity * Particle.SPEED;
      }
    }
  }

  private static vectorUpdate(x: number, y: number, tx: number, ty: number, vx: number, vy: number) {
    var px = tx - x;
    var py = ty - y;
    var r = Math.sqrt(px * px + py * py) * 3.0;
    if (r !== 0.0) {
      px /= r;
      py /= r;
    }
    px += vx;
    py += vy;
    r = Math.sqrt(px * px + py * py);
    if (r !== 0.0) {
      px /= r;
      py /= r;
    }
    return [px, py];
  }
}

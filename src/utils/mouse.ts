export default class Mouse {
  private constructor() {}
  public static x: number = 0;
  public static y: number = 0;

  public static mouseMove(canvas: HTMLCanvasElement) {
    canvas.addEventListener("mousemove", (e) => {
      Mouse.x = e.offsetX / canvas.width;
      Mouse.y = e.offsetY / canvas.height;
    });
  }
}

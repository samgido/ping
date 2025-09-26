export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public mul(n: number) {
    return new Vector(this.x * n, this.y * n);
  }
}
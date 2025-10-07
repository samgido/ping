export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static fromMouseEvent(event: MouseEvent) {
    return new Vector(event.offsetX, event.offsetY);
  }

  public normalize() {
    const l = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    if (l == 0)
      return new Vector(0, 0);

    return new Vector(this.x, this.y).mul(1 / l);
  }

  public apply(f: (x: number) => number) {
    return new Vector(f(this.x), f(this.y));
  }

  public addScalar(n: number) {
    return new Vector(this.x + n, this.y + n);
  }

  public addVector(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  public subtractScalar(n: number) {
    return this.addScalar(-1 * n);
  }

  public subtractVector(v: Vector) {
    return this.addVector(v.mul(-1));
  }

  public mul(n: number) {
    return new Vector(this.x * n, this.y * n);
  }

  public equals(v: Vector) {
    return this.x === v.x && this.y === v.y;
  }

  public toTuple(): [number, number] {
    return [this.x, this.y];
  }

  public toKey() {
    return this.x + "," + this.y;
  }
}

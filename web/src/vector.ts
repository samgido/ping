export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
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
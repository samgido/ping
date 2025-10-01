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

  public toTuple(): [number, number] {
    return [this.x, this.y];
  }

  public equals(v: Vector): boolean {
    return this.x === v.x && this.y === v.y;
  }

  public toKey(): string {
    return this.x + "," + this.y;
  }
}
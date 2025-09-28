import { Vector } from "./vector";

export class Board {
  size: Vector
  barriers: Vector[]

  constructor(size: Vector) {
    this.size = size;
    this.barriers = [];

    for (var i = 0; i < size.x; i++) {
      for (var j = 0; j < size.y; j++) {
      }
    }
  }

  public addBarrierRect(p1: Vector, p2: Vector) {
    let [v1, v2] = this.orderVectors(p1, p2);

    for (var i = 0; i <= v2.x - v1.x; i++) {
      if (!this.validX(i))
        continue;

      for (var j = 0; j <= v2.y - v1.y; j++) {
        if (!this.validY(j))
          continue;

        this.barriers = this.barriers.concat(new Vector(i + v1.x, j + v1.y));
      }
    }

    console.log(this.barriers);
  }

  private orderVectors(p1: Vector, p2: Vector): [Vector, Vector] {
    let x1 = Math.min(p1.x, p2.x);
    let y1 = Math.min(p1.y, p2.y);

    let x2 = Math.max(p1.x, p2.x);
    let y2 = Math.max(p1.y, p2.y);

    return [
      new Vector(x1, y1),
      new Vector(x2, y2)
    ];
  }

  private validX(n: number) {
    return n >= 0 || n < this.size.x;
  }

  private validY(n: number) {
    return n >= 0 || n < this.size.y;
  }
}
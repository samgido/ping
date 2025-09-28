import { Vector } from "./vector";

export class Board {
  size: Vector
  grid: boolean[][]

  constructor(size: Vector) {
    this.size = size;
    this.grid = [];

    for (var i = 0; i < size.x; i++) {
      this.grid[i] = [];
      for (var j = 0; j < size.y; j++) {
        this.grid[i][j] = false;
      }
    }
  }

  public addBarrierRect(p1: Vector, p2: Vector) {
    let [v1, v2] = this.orderVectors(p1, p2);

    for (var i = 0; i <= v2.x - v1.x; i++) {
      if (!this.validX(i + v1.x))
        continue;

      for (var j = 0; j <= v2.y - v1.y; j++) {
        if (!this.validY(j + v1.y))
          continue;

        this.grid[i + v1.x][j + v1.y] = true;
      }
    }
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
    return n >= 0 && n < this.size.x;
  }

  private validY(n: number) {
    return n >= 0 && n < this.size.y;
  }
}
import { Vector } from "./vector";
import { MinHeap } from "./data_structures";

export class Board {
  size: Vector;
  grid: boolean[][] = [];
  shortest_path: Vector[] = [];

  constructor(size: Vector) {
    this.size = size;

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
        console.log('Setting (' + i + v1.x + ',' + j + v1.y + ')');
      }
    }
  }

  public modifyBarrierRect(p1: Vector, p2: Vector, f: (v: boolean) => boolean) {
    let [v1, v2] = this.orderVectors(p1, p2);

    for (var i = 0; i <= v2.x - v1.x; i++) {
      if (!this.validX(i + v1.x))
        continue;

      for (var j = 0; j <= v2.y - v1.y; j++) {
        if (!this.validY(j + v1.y))
          continue;

        this.grid[i + v1.x][j + v1.y] = f(this.grid[i + v1.x][j + v1.y]);
      }
    }
  }

  public getBoardValueOrDefault(def: boolean, p: Vector) {
    return this.validPoint(p) ? this.grid[p.x][p.y] : def;
  }

  public getShortestPath(player: Vector, finish: Vector): Vector[] {
    type Node = {
      p: Vector,
      f: number
      parent: Vector | null
    };

    const distToFinish = (v1: Vector) => {
      const a = Math.pow(finish.x - v1.x, 2);
      const b = Math.pow(finish.y - v1.y, 2);

      return Math.sqrt(a + b);
    }

    const openList: MinHeap<Node, string> = new MinHeap(
      (a, b) => a.f - b.f,
      (v) => v.p.toKey(),
    );
    openList.insert({
      p: player,
      f: 0,
      parent: null,
    });

    const closedList: Map<string, Node> = new Map();

    while (openList.size() > 0) {
      const current_node = openList.extractMin(); // Get node in openlist with lowest f

      if (current_node == undefined) {
        console.log("openList empty in A* while loop");
        break;
      }

      closedList.set(current_node.p.toKey(), current_node);

      if (current_node.p.equals(finish))
        break;

      const neighbors = this.getNeighbors(current_node.p)
        .filter((v) => !this.getBoardValueOrDefault(true, v));

      for (var neighbor of neighbors) {
        if (closedList.has(neighbor.toKey()))
          continue;

        const cost = current_node.f + distToFinish(neighbor);

        const existingNode = openList.get(neighbor.toKey());
        if (existingNode != null) {
          openList.update(existingNode.p.toKey(), {
            p: neighbor,
            f: Math.min(cost, existingNode.f),
            parent: current_node.p
          });
        } else
          openList.insert({
            p: neighbor,
            f: cost,
            parent: current_node.p
          });
      }
    }

    var path: Vector[] = [];

    var current_node: Node | undefined = closedList.get(finish.toKey());

    if (current_node == undefined)
      return [];

    while (current_node != undefined) {
      path = path.concat(current_node.p);
      current_node = current_node.parent == null ? undefined : closedList.get(current_node.parent.toKey());
    }

    return path;
  }

  private getNeighbors(p: Vector): Vector[] {
    return [
      new Vector(p.x + 1, p.y),
      new Vector(p.x - 1, p.y),
      new Vector(p.x, p.y + 1),
      new Vector(p.x, p.y - 1),
    ];
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

  private validPoint(p: Vector) {
    return this.validX(p.x) && this.validY(p.y);
  }

  private validX(n: number) {
    return n >= 0 && n < this.size.x;
  }

  private validY(n: number) {
    return n >= 0 && n < this.size.y;
  }
}
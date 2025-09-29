import { Vector } from "./vector";

export class Board {
  size: Vector
  grid: boolean[][]
  shortest_path: Vector[]

  constructor(size: Vector) {
    this.size = size;
    this.shortest_path = [];
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
        console.log('Setting (' + i + v1.x + ',' + j + v1.y + ')');
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

    var openList: Map<string, Node> = new Map();
    openList.set(player.toKey(), {
      p: player,
      f: 0,
      parent: null,
    });

    var closedList: Map<string, Node> = new Map(); // Fuckass definition, cleanup the type

    while (openList.size > 0) {
      var lowest_f: Node | null = null;
      for (var [k, v] of openList.entries()) { // Should be done in a minheap
        if (lowest_f == null)
          lowest_f = v;

        if (v.f < lowest_f.f) {
          lowest_f = v;
        }
      }
      if (lowest_f == null) {
        console.log("Something went wrong in A*");
        break;
      }

      openList.delete(lowest_f.p.toKey());

      closedList.set(lowest_f.p.toKey(), lowest_f);

      if (lowest_f.p.x == finish.x && lowest_f.p.y == finish.y)
        break;

      const neighbor_ps = [
        new Vector(lowest_f.p.x - 1, lowest_f.p.y),
        new Vector(lowest_f.p.x + 1, lowest_f.p.y),
        new Vector(lowest_f.p.x, lowest_f.p.y - 1),
        new Vector(lowest_f.p.x, lowest_f.p.y + 1),
      ].filter((v: Vector, _i, _a) => !this.getBoardValueOrDefault(true, v));

      for (var neighbor of neighbor_ps) {
        if (closedList.has(neighbor.toKey()))
          continue;

        const cost = lowest_f.f + Math.sqrt(Math.pow(finish.x - neighbor.x, 2) + Math.pow(finish.y - neighbor.y, 2));
        if (openList.has(neighbor.toKey())) {
          const existingNode = openList.get(neighbor.toKey());
          if (existingNode != undefined) {
            existingNode.f = Math.min(cost, existingNode.f);
            existingNode.parent = lowest_f.p;
            openList.set(neighbor.toKey(), existingNode);
          }
        } else
          openList.set(neighbor.toKey(), {
            p: neighbor,
            f: cost,
            parent: lowest_f.p,
          });
      }
    }

    // Construct path
    var path: Vector[] = [];

    var current_node: Node | null | undefined = closedList.get(finish.toKey()); // what the fuck

    if (current_node == undefined)
      return [];

    while (current_node != null) {
      path = path.concat(current_node.p);
      current_node = current_node.parent == null ? null : closedList.get(current_node.parent.toKey());
    }

    return path;
  }

  public doesPathExist(player: Vector, finish: Vector): boolean {
    const visited = new Set<Vector>();

    const dfs = (node: Vector): boolean => {
      if (node.x == finish.x && node.y == finish.y)
        return true;

      if (visited.has(node))
        return false;

      visited.add(node);
      const neighbors = [
        new Vector(node.x + 1, node.y),
        new Vector(node.x - 1, node.y),
        new Vector(node.x, node.y + 1),
        new Vector(node.x, node.y - 1),
      ]

      for (const neighbor of neighbors) {
        if (!this.getBoardValueOrDefault(true, neighbor)) {
          if (dfs(neighbor))
            return true;
        }
      }

      return false;
    };

    return dfs(player);
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
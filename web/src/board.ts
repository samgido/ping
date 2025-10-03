import { Vector } from "./vector";
import { MinHeap } from "./data_structures";
import { orderedPairs } from "./util";

export enum Direction {
  North,
  South,
  East,
  West
}

type CreateRect = {
  type: 'create_rect',
  p1: Vector,
  p2: Vector
}

type CreateCircle = {
  type: 'create_circle',
  c: Vector,
  radius: number
}

type Modification =
  | CreateRect
  | CreateCircle;

export class Board {
  size: Vector;
  grid: boolean[][] = [];
  shortest_path: Vector[] = [];
  modifications: Modification[] = [];
  redo_modifications: Modification[] = [];

  constructor(size: Vector) {
    this.size = size;
    this.grid = initializeBoardGrid(size, false);
  }

  public popModification(): boolean {
    const mod = this.modifications.pop();

    if (mod != undefined)
      this.redo_modifications.push(mod);

    return mod != undefined;
  }

  public redoLastModification() {
    const mod = this.redo_modifications.pop();

    if (mod != undefined) {
      this.applyModification(mod);
      this.pushModification(mod);
      this.rebuildBoard();
    }
  }

  public clearRedos() {
    this.redo_modifications = [];
  }

  public pushModification(modification: Modification) {
    this.modifications.push(modification);
  }

  public rebuildBoard() {
    this.grid = initializeBoardGrid(this.size, false);

    this.modifications.forEach((mod) => {
      this.applyModification(mod);
    });
  }

  private applyModification(modification: Modification) {
    switch (modification.type) {
      case "create_rect":
        this.modifyBarrierRect(modification.p1, modification.p2, (_) => true);
        break;
      case "create_circle":
        console.log("Restoring circles not implemented yet");
        break;
    }
  }

  // Get the value of a cell, if out of bounds a default value
  public getBoardValueOrDefault(def: boolean, p: Vector) {
    return this.validPoint(p) ? this.grid[p.x][p.y] : def;
  }

  // Operate on each cell on the grid
  public applyOnBoard(f: (l: [number, number]) => void) {
    for (const l of orderedPairs(this.size))
      f(l);
  }

  // Get adjacent cells 
  public getNeighbors: (p: Vector) => [Vector, Direction][] = (p: Vector) => [
    [new Vector(p.x, p.y - 1), Direction.North],
    [new Vector(p.x, p.y + 1), Direction.South],
    [new Vector(p.x + 1, p.y), Direction.East],
    [new Vector(p.x - 1, p.y), Direction.West],
  ];

  // Operate on each cell in a rectangle
  public modifyBarrierRect(p1: Vector, p2: Vector, f: (v: boolean) => boolean) {
    let [v1, v2] = this.orderVectors(p1, p2);

    const area = v2.subtractVector(v1)
      .addScalar(1); // Add scalar for inclusivity

    for (const [i, j] of orderedPairs(area)) {
      const [k, l] = [i + v1.x, j + v1.y];

      if (!this.validPoint(new Vector(k, l)))
        continue;

      this.grid[k][l] = f(this.grid[k][l]);
    }
  }

  public refreshShortestPath(player: Vector, finish: Vector): boolean {
    this.shortest_path = this.getShortestPath(player, finish);
    return this.shortest_path.length > 0;
  }

  public getShortestPath(player: Vector, finish: Vector): Vector[] {
    // How nodes are stored in the open/closed lists
    type Node = {
      p: Vector,
      f: number
      parent: Vector | null
    };

    // Helper function
    const dist_to_finish = (v1: Vector) => {
      const a = Math.pow(finish.x - v1.x, 2);
      const b = Math.pow(finish.y - v1.y, 2);

      return Math.sqrt(a + b);
    };

    // Initialize A*
    const open_list: MinHeap<Node, string> = new MinHeap(
      (a, b) => a.f - b.f,
      (v) => v.p.toKey(),
    );

    const closed_list: Map<string, Node> = new Map();

    // Run A*
    open_list.insert({
      p: player,
      f: 0,
      parent: null,
    });

    while (open_list.size() > 0) {
      const current_node = open_list.extractMin(); // Get node in openlist with lowest f

      if (current_node == undefined) {
        console.log("openList empty in A* while loop");
        break;
      }

      closed_list.set(current_node.p.toKey(), current_node);

      if (current_node.p.equals(finish)) // At finish
        break;

      this.getNeighbors(current_node.p)
        .map(([v, _]) => v) // Don't care about the direction
        .filter((v) => !this.getBoardValueOrDefault(true, v))
        .filter((v) => !closed_list.has(v.toKey()))
        .forEach((neighbor) => {
          const cost = current_node.f + dist_to_finish(neighbor);
          const existing_node = open_list.get(neighbor.toKey());

          if (existing_node != null) {
            open_list.update(existing_node.p.toKey(), {
              p: neighbor,
              f: Math.min(cost, existing_node.f),
              parent: current_node.p
            });
          } else
            open_list.insert({
              p: neighbor,
              f: cost,
              parent: current_node.p
            });
        });
    }

    // Reconstruct path 
    var path: Vector[] = [];
    var current_node = closed_list.get(finish.toKey());

    if (current_node == undefined)
      return [];

    while (current_node != undefined) {
      path = path.concat(current_node.p);
      current_node = current_node.parent == null ? undefined : closed_list.get(current_node.parent.toKey());
    }

    return path;
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

  // Order vector components s.t. v1.x < v2.x and v1.y < v2.y
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

}

function initializeBoardGrid(size: Vector, v: boolean): boolean[][] {
  const grid: boolean[][] = [];

  for (var i = 0; i < size.x; i++) {
    grid[i] = [];
    for (var j = 0; j < size.y; j++) {
      grid[i][j] = v;
    }
  }

  return grid;
}

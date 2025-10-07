import { Vector } from "./vector";
import { MinHeap } from "./data_structures";
import { orderedPairs, orderVectors, pointToTile } from "./util";
import { TILE_SIZE } from "./display_driver";
import { PLAYER_SIZE } from "./user_types/maze_player";

export enum Direction {
  North = 'w',
  South = 's',
  East = 'd',
  West = 'a'
}

export function directionToVectorMap(dir: Direction) {
  switch (dir) {
    case Direction.North: return new Vector(0, -1);
    case Direction.South: return new Vector(0, 1);
    case Direction.East: return new Vector(1, 0);
    case Direction.West: return new Vector(-1, 0);
  }
}

export type RectModification = {
  type: 'rect',
  modify: (v: boolean) => boolean,
  p1: Vector,
  p2: Vector
}

export type CircleModification = {
  type: 'circle',
  modify: (v: boolean) => boolean,
  c: Vector,
  radius: number
}

type Modification =
  | RectModification
  | CircleModification;

export class GameState {
  size: Vector;
  grid: boolean[][] = [];
  shortest_path: Vector[] = [];

  modifications: Modification[] = [];
  undone_modifications: Modification[] = []; // 'redo' stack

  player: Vector;
  finish: Vector;

  constructor(size: Vector) {
    this.size = size;
    this.grid = initializeBoardGrid(size, false);

    this.player = new Vector(5, 10);
    this.finish = new Vector(15, 10);
  }

  public isPlayerPositionValid(p: Vector) {
    return !this.getTilesPlayerPositionIsTouching(p)
      .some((v) => this.getBoardValueOrDefault(true, v));
  }

  public getTilesPlayerPositionIsTouching(p: Vector) {
    return [
      p,
      new Vector(p.x + PLAYER_SIZE, p.y),
      new Vector(p.x, p.y + PLAYER_SIZE),
      new Vector(p.x + PLAYER_SIZE, p.y + PLAYER_SIZE),
    ].map((v) => pointToTile(v));
  }

  private popModification(): boolean {
    const mod = this.modifications.pop();
    const valid = mod != undefined;

    if (valid)
      this.undone_modifications.push(mod);

    return valid;
  }

  public redoModification() {
    const mod = this.undone_modifications.pop();

    if (mod == undefined)
      return false;

    this.applyModification(mod);
    this.pushModification(mod);
    this.rebuildBoard();
    this.refreshShortestPath();

    return true;
  }

  public undoModification() {
    if (this.popModification()) {
      this.rebuildBoard();
      this.refreshShortestPath();
    }
  }

  public clearUndoneModifications() {
    this.undone_modifications = [];
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

  public applyModification(mod: Modification) {
    switch (mod.type) {
      case 'rect':
        this.modifyBarrierRect(mod.p1, mod.p2, mod.modify);
        break;
      case 'circle':
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
  private modifyBarrierRect(p1: Vector, p2: Vector, f: (v: boolean) => boolean) {
    let [v1, v2] = orderVectors(p1, p2);

    const area = v2.subtractVector(v1)
      .addScalar(1); // Add scalar for inclusivity

    for (const [i, j] of orderedPairs(area)) {
      const [k, l] = [i + v1.x, j + v1.y];

      if (!this.validPoint(new Vector(k, l)))
        continue;

      this.grid[k][l] = f(this.grid[k][l]);
    }
  }

  public refreshShortestPath(): boolean {
    this.shortest_path = this.getShortestPath(this.player, this.finish);
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
    const player_tile = pointToTile(new Vector(this.player.x + Math.floor(PLAYER_SIZE / 2), this.player.y + Math.floor(PLAYER_SIZE / 2)));
    open_list.insert({
      p: player_tile,
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

  public getDrawer(context: CanvasRenderingContext2D) {
    return {
      draw_grid: () => {
        context.strokeStyle = 'gray';
        this.applyOnBoard(([i, j]) => {
          context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        });
      },

      draw_barriers: () => {
        this.applyOnBoard(([i, j]) => {
          if (!this.grid[i][j])
            return;

          context.strokeStyle = 'blue';
          context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);

          context.strokeStyle = 'red';
          this.getNeighbors(new Vector(i, j))
            .filter(([v, _]) => !this.getBoardValueOrDefault(false, v))
            .forEach(([v, dir]) => {
              switch (dir) {
                case Direction.North:
                  context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, 0);
                  break;
                case Direction.South:
                  context.strokeRect(i * TILE_SIZE, v.y * TILE_SIZE, TILE_SIZE, 0);
                  break;
                case Direction.East:
                  context.strokeRect(v.x * TILE_SIZE, j * TILE_SIZE, 0, TILE_SIZE);
                  break;
                case Direction.West:
                  context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, 0, TILE_SIZE);
                  break;
              }
            });
        });
      },

      draw_player: () => {
        context.fillStyle = 'purple';
        context.fillRect(this.player.x, this.player.y, PLAYER_SIZE, PLAYER_SIZE);
      },

      draw_finish: () => {
        context.fillStyle = 'white';
        context.fillRect(this.finish.x * TILE_SIZE, this.finish.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      },

      draw_shortest_path: () => {
        context.fillStyle = 'pink';
        const path_offset = TILE_SIZE / 3;
        this.shortest_path
          .filter((v) => !v.equals(this.player) && !v.equals(this.finish))
          .forEach((v) => {
            context.fillRect(
              v.x * TILE_SIZE + path_offset,
              v.y * TILE_SIZE + path_offset,
              TILE_SIZE - (2 * path_offset),
              TILE_SIZE - (2 * path_offset)
            );
          });
      }
    }
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

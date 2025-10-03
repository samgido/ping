import { Board, Direction } from "./board";
import { Vector } from "./vector";

const TILE_SIZE = 25; // Pixels

export class DisplayDriver {
  context: CanvasRenderingContext2D
  camera_offset: Vector = new Vector(0, 0);
  board: Board

  player: Vector;
  finish: Vector;

  first_selection: Vector | null = null;

  constructor(context: CanvasRenderingContext2D) {
    this.board = new Board(new Vector(100, 100));
    this.context = context;

    this.player = new Vector(5, 15);
    this.finish = new Vector(10, 15);

    this.refreshShortestPath();
  }

  public handleUndo() {
    this.board.popModification();
    this.board.rebuildBoard();

    this.refreshShortestPath();
  }

  public handleRedo() {
    this.board.redoModification();
    this.refreshShortestPath();
  }

  public resize() {
    const rect = this.context.canvas.parentElement!.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio;

    const screen = new Vector(rect.width, rect.height);
    this.context.canvas.style.width = `${screen.x}px`;
    this.context.canvas.style.height = `${screen.y}px`;

    const canvas_size = screen.mul(pixelRatio);

    this.context.canvas.width = canvas_size.x;
    this.context.canvas.height = canvas_size.y;

    this.context.scale(pixelRatio, pixelRatio);
  }

  public handlePointerDown(p: Vector) {
    let tile = new Vector(Math.floor(p.x / TILE_SIZE), Math.floor(p.y / TILE_SIZE));

    if (this.first_selection == null) {
      this.first_selection = tile;
    } else {
      this.board.modifyBarrierRect(this.first_selection, tile, (_) => true); // Set cells to true in the rectangle
      this.board.pushModification({
        type: "create_rect",
        p1: tile,
        p2: this.first_selection
      });

      const found_path = this.refreshShortestPath();
      if (found_path) {
        this.board.clearUndoneModifications();
      } else
        this.handleUndo(); // Reuse works for now

      this.first_selection = null;
    }
  }

  public drawBoard() {
    // Clear screen
    this.context.fillStyle = 'green';
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    this.context.lineWidth = 2;

    // Draw grid
    this.context.strokeStyle = 'gray';
    this.board.applyOnBoard(([i, j]) => {
      this.context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });

    // Draw barriers
    this.board.applyOnBoard(([i, j]) => {
      if (this.board.grid[i][j]) {
        this.context.strokeStyle = 'blue';
        this.context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        this.context.strokeStyle = 'red';
        this.board.getNeighbors(new Vector(i, j))
          .filter(([v, _]) => !this.board.getBoardValueOrDefault(false, v))
          .forEach(([v, dir]) => {
            switch (dir) {
              case Direction.North:
                this.context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, 0);
                break;
              case Direction.South:
                this.context.strokeRect(i * TILE_SIZE, v.y * TILE_SIZE, TILE_SIZE, 0);
                break;
              case Direction.East:
                this.context.strokeRect(v.x * TILE_SIZE, j * TILE_SIZE, 0, TILE_SIZE);
                break;
              case Direction.West:
                this.context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, 0, TILE_SIZE);
                break;
            }
          });
      }
    });

    // Draw player
    this.context.fillStyle = 'purple';
    this.context.fillRect(this.player.x * TILE_SIZE, this.player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // Draw finish
    this.context.fillStyle = 'white';
    this.context.fillRect(this.finish.x * TILE_SIZE, this.finish.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // Draw shortest path
    this.context.fillStyle = 'pink';
    const path_offset = TILE_SIZE / 3;
    this.board.shortest_path
      .filter((v) => !v.equals(this.player) && !v.equals(this.finish))
      .forEach((v) => {
        this.context.fillRect(
          v.x * TILE_SIZE + path_offset,
          v.y * TILE_SIZE + path_offset,
          TILE_SIZE - (2 * path_offset),
          TILE_SIZE - (2 * path_offset)
        );
      });
  }

  private refreshShortestPath() {
    return this.board.refreshShortestPath(this.player, this.finish);
  }
}

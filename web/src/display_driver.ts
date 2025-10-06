import { GameState, Direction } from "./game_objects";
import { Vector } from "./vector";

export const TILE_SIZE = 25; // Pixels

export class DisplayDriver {
  context: CanvasRenderingContext2D
  game_state: GameState

  first_selection: Vector | null = null;

  constructor(context: CanvasRenderingContext2D, game_state: GameState) {
    this.context = context;
    this.game_state = game_state;

    this.game_state.refreshShortestPath();
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

  public drawBoard() {
    // Clear screen
    this.context.fillStyle = 'green';
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    this.context.lineWidth = 2;

    // Draw grid
    this.context.strokeStyle = 'gray';
    this.game_state.applyOnBoard(([i, j]) => {
      this.context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });

    // Draw barriers
    this.game_state.applyOnBoard(([i, j]) => {
      if (!this.game_state.grid[i][j])
        return;

      this.context.strokeStyle = 'blue';
      this.context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      this.context.strokeStyle = 'red';
      this.game_state.getNeighbors(new Vector(i, j))
        .filter(([v, _]) => !this.game_state.getBoardValueOrDefault(false, v))
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
    });

    // Draw player
    this.context.fillStyle = 'purple';
    this.context.fillRect(this.game_state.player.x * TILE_SIZE, this.game_state.player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // Draw finish
    this.context.fillStyle = 'white';
    this.context.fillRect(this.game_state.finish.x * TILE_SIZE, this.game_state.finish.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // Draw shortest path
    this.context.fillStyle = 'pink';
    const path_offset = TILE_SIZE / 3;
    this.game_state.shortest_path
      .filter((v) => !v.equals(this.game_state.player) && !v.equals(this.game_state.finish))
      .forEach((v) => {
        this.context.fillRect(
          v.x * TILE_SIZE + path_offset,
          v.y * TILE_SIZE + path_offset,
          TILE_SIZE - (2 * path_offset),
          TILE_SIZE - (2 * path_offset)
        );
      });
  }
}

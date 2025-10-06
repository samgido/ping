import { TILE_SIZE } from "../display_driver";
import { Direction, GameState, RectModification } from "../game_objects";
import { UserType } from "../user";
import { Vector } from "../vector";

export class MazeCreatorUser implements UserType {
  game_state: GameState

  first_selection: Vector | null = null;

  constructor(game_state: GameState) {
    this.game_state = game_state;
  }

  public handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case "z":
        this.game_state.undoModification();
        break;
      case "y":
        this.game_state.redoModification();
        break;
    }
  }

  public handlePointerDown(event: PointerEvent): void {
    let tile = new Vector(Math.floor(event.offsetX / TILE_SIZE), Math.floor(event.offsetY / TILE_SIZE));

    if (this.first_selection == null) {
      this.first_selection = tile;
      return;
    }

    const mod: RectModification = {
      type: 'rect',
      modify: (_) => true,
      p1: this.first_selection,
      p2: tile,
    };

    this.game_state.applyModification(mod);
    this.game_state.pushModification(mod);

    const is_new_maze_correct = this.game_state.refreshShortestPath();
    if (is_new_maze_correct) {
      this.game_state.clearUndoneModifications(); // The new barrier is accepted, so the redo stack should be cleared
    } else
      this.game_state.undoModification(); // Undo the modification, reusing handler works for now

    this.first_selection = null;
  }

  public draw(context: CanvasRenderingContext2D) {
    // Clear screen
    context.fillStyle = 'green';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    context.lineWidth = 2;

    // Draw grid
    context.strokeStyle = 'gray';
    this.game_state.applyOnBoard(([i, j]) => {
      context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });

    // Draw barriers
    this.game_state.applyOnBoard(([i, j]) => {
      if (!this.game_state.grid[i][j])
        return;

      context.strokeStyle = 'blue';
      context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      context.strokeStyle = 'red';
      this.game_state.getNeighbors(new Vector(i, j))
        .filter(([v, _]) => !this.game_state.getBoardValueOrDefault(false, v))
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

    // Draw player
    context.fillStyle = 'purple';
    context.fillRect(this.game_state.player.x * TILE_SIZE, this.game_state.player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // Draw finish
    context.fillStyle = 'white';
    context.fillRect(this.game_state.finish.x * TILE_SIZE, this.game_state.finish.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // Draw shortest path
    context.fillStyle = 'pink';
    const path_offset = TILE_SIZE / 3;
    this.game_state.shortest_path
      .filter((v) => !v.equals(this.game_state.player) && !v.equals(this.game_state.finish))
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
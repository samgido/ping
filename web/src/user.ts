import { GameState, RectModification } from "./game_objects"
import { TILE_SIZE } from "./display_driver"
import { Vector } from "./vector"

export interface UserType {
  handleKeyDown(event: KeyboardEvent): void
  handlePointerDown(event: PointerEvent): void

  game_state: GameState
}

export class MazeCreator implements UserType {
  game_state: GameState

  first_selection: Vector | null = null;

  constructor(game_state: GameState) {
    this.game_state = game_state;
  }

  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case "z":
        this.game_state.undoModification();
        break;
      case "y":
        this.game_state.redoModification();
        break;
    }
  }

  handlePointerDown(event: PointerEvent): void {
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
}

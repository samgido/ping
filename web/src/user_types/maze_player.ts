import { Direction, GameState } from "../game_objects";
import { UserType } from "../user";

export class MazePlayerUser implements UserType {
  game_state: GameState

  constructor(game_state: GameState) {
    this.game_state = game_state;
  }

  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'w':
      case 'a':
      case 's':
      case 'd':
        const dir = event.key as Direction;
        this.game_state.movePlayer(dir);
        break;
    }
  }

  handlePointerDown(event: PointerEvent): void { }

  draw(context: CanvasRenderingContext2D): void { }
}
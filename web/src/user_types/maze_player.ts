import { TILE_SIZE } from "../display_driver";
import { Direction, directionToVectorMap, GameState } from "../game_objects";
import { UserType } from "./user_types";
import { Vector } from "../vector";

export class MazePlayerUser extends UserType {
  game_state: GameState
  camera_offset: Vector = new Vector(0, 0);
  camera_scale: number = 1;

  constructor(game_state: GameState) {
    super();

    this.game_state = game_state;
  }

  handleKeyDown(event: KeyboardEvent): void {
    var movement = new Vector(0, 0);
    switch (event.key) {
      case 'w':
        movement = movement.addVector(directionToVectorMap(Direction.North));
        break;
      case 'a':
        movement = movement.addVector(directionToVectorMap(Direction.West));
        break;
      case 's':
        movement = movement.addVector(directionToVectorMap(Direction.South));
        break;
      case 'd':
        movement = movement.addVector(directionToVectorMap(Direction.East));
        break;
    }
    this.game_state.movePlayer(movement);
  }

  handlePointerDown(event: PointerEvent): void { }

  handlePointerMove(event: PointerEvent): void { }

  drawGame(context: CanvasRenderingContext2D): void {
    // Draw player
    context.fillStyle = 'purple';
    context.fillRect(this.game_state.player.x * TILE_SIZE, this.game_state.player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // Draw finish
    context.fillStyle = 'white';
    context.fillRect(this.game_state.finish.x * TILE_SIZE, this.game_state.finish.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}
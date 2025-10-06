import { TILE_SIZE } from "../display_driver";
import { Direction, directionToVectorMap, GameState } from "../game_objects";
import { UserType } from "../user";
import { Vector } from "../vector";

export class MazePlayerUser implements UserType {
  game_state: GameState

  camera_offset: Vector = new Vector(0, 0);
  camera_scale: number = 1;

  constructor(game_state: GameState) {
    this.game_state = game_state;
  }

  handleKeyDown(event: KeyboardEvent): void {
    var movement = new Vector(0, 0);
    switch (event.key) {
      case 'w':
        movement.addVector(directionToVectorMap(Direction.North));
      case 'a':
        movement.addVector(directionToVectorMap(Direction.West));
      case 's':
        movement.addVector(directionToVectorMap(Direction.South));
      case 'd':
        movement.addVector(directionToVectorMap(Direction.East));
        this.game_state.movePlayer(movement);
        break;
    }
  }

  handlePointerDown(event: PointerEvent): void { }

  handlePointerMove(event: PointerEvent): void { }

  drawGame(context: CanvasRenderingContext2D): void {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();
    context.scale(this.camera_scale, this.camera_scale);
    context.translate(-1 * this.camera_offset.x, -1 * this.camera_offset.y);

    // Draw player
    context.fillStyle = 'purple';
    context.fillRect(this.game_state.player.x * TILE_SIZE, this.game_state.player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // Draw finish
    context.fillStyle = 'white';
    context.fillRect(this.game_state.finish.x * TILE_SIZE, this.game_state.finish.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    context.restore();
  }
}
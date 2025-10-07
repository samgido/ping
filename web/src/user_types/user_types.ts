import { GameState } from "../game_objects"
import { Vector } from "../vector"

export abstract class UserType {
  abstract game_state: GameState;

  abstract camera_offset: Vector
  abstract camera_scale: number

  abstract handleKeyDown(event: KeyboardEvent): void

  abstract handleKeyUp(event: KeyboardEvent): void

  abstract handlePointerDown(event: PointerEvent): void

  abstract handlePointerMove(event: PointerEvent): void

  abstract updateWorld(context: CanvasRenderingContext2D): void

  abstract tick(delta_time: number): void

  canvasPointToWorldSpace(p: Vector): Vector {
    return p.mul(1 / this.camera_scale).addVector(this.camera_offset);
  }

  updateGame(context: CanvasRenderingContext2D) {
    // Just some boiler plate to apply the camera transform before drawing game objects
    // Game objects are drawn in world space
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();
    context.scale(this.camera_scale, this.camera_scale);
    context.translate(-1 * this.camera_offset.x, -1 * this.camera_offset.y);

    this.updateWorld(context);

    context.restore();
  }
}

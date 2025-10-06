import { GameState } from "./game_objects"
import { Vector } from "./vector"

export interface UserType {
  game_state: GameState

  camera_offset: Vector
  camera_scale: number

  handleKeyDown(event: KeyboardEvent): void

  handlePointerDown(event: PointerEvent): void

  handlePointerMove(event: PointerEvent): void

  drawGame(context: CanvasRenderingContext2D): void
}

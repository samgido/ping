import { GameState } from "./game_objects"

export interface UserType {
  game_state: GameState

  handleKeyDown(event: KeyboardEvent): void

  handlePointerDown(event: PointerEvent): void

  draw(context: CanvasRenderingContext2D): void
}

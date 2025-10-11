import { TILE_SIZE } from "../display_driver";
import { createPing, GameState } from "../game_objects";
import { UserType } from "./user_types";
import { Vector } from "../vector";
import { getRandomInt } from "../util";

const PLAYER_SPEED = 175; // Units / second
export const PLAYER_SIZE = Math.floor(TILE_SIZE * 0.8);

export class MazePlayerUser extends UserType {
  game_state: GameState
  camera_offset: Vector = new Vector(0, 0);
  camera_scale: number = 1;

  player_velocity: Vector = new Vector(0, 0);
  keys_down: Map<string, boolean> = new Map();

  constructor(game_state: GameState) {
    super();

    this.game_state = game_state;
  }

  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'w':
      case 's':
      case 'a':
      case 'd':
        this.keys_down.set(event.key, true);
        break;
      case " ":
        this.game_state.pings.set(getRandomInt(), createPing(this.game_state.player));
        break;
    }
  }

  handleKeyUp(event: KeyboardEvent): void {
    switch (event.key) {
      case 'w':
      case 's':
      case 'a':
      case 'd':
        this.keys_down.set(event.key, false);
        break;
    }
  }

  tick(delta_time: number) {
    var vx = 0;
    var vy = 0;

    if (this.keys_down.get('w'))
      vy = -1;
    if (this.keys_down.get('s'))
      vy = 1;
    if (this.keys_down.get('a'))
      vx = -1;
    if (this.keys_down.get('d'))
      vx = 1;

    const apply_movement_if_valid = (move: Vector) => {
      const movement = move.normalize().mul(PLAYER_SPEED * delta_time);
      const new_pos = this.game_state.player.addVector(movement);
      const valid = this.game_state.isPlayerPositionValid(new_pos);

      if (valid)
        this.game_state.player = new_pos;
    };

    apply_movement_if_valid(new Vector(vx, 0));
    apply_movement_if_valid(new Vector(0, vy));
  }

  handlePointerDown(_: PointerEvent): void { }

  handlePointerMove(_: PointerEvent): void { }

  updateWorld(context: CanvasRenderingContext2D): void {
    const drawer = this.game_state.getDrawer(context);
    drawer.draw_player();
    drawer.draw_finish();

    // drawer.draw_barriers();

    drawer.draw_ping_particles_connected();
  }
}

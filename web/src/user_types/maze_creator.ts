import { TILE_SIZE } from "../display_driver";
import { Direction, directionToVectorMap, GameState, RectModification } from "../game_objects";
import { UserType } from "./user_types";
import { orderedPairsOverArea, pointToTile } from "../util";
import { Vector } from "../vector";

export class MazeCreatorUser extends UserType {
  game_state: GameState
  camera_offset: Vector = new Vector(0, 0);
  camera_scale = 1;

  first_selection: Vector | null = null;
  selection_hover: Vector = new Vector(0, 0);

  constructor(game_state: GameState) {
    super(); // kill me

    this.game_state = game_state;
    this.game_state.refreshShortestPath();
  }

  tick(delta_time: number): void { }

  public handleKeyDown(event: KeyboardEvent): void {
    var movement = new Vector(0, 0);

    switch (event.key) {
      case "ArrowUp":
        this.camera_scale = Math.max(0.1, this.camera_scale * 1.1);
        break;
      case "ArrowDown":
        this.camera_scale = Math.max(0.1, this.camera_scale * 0.9);
        break;
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
      case "z":
        this.game_state.undoModification();
        break;
      case "y":
        this.game_state.redoModification();
        break;
    }

    this.camera_offset = this.camera_offset.addVector(movement.mul(TILE_SIZE));
  }

  handleKeyUp(event: KeyboardEvent): void { }

  public handlePointerDown(event: PointerEvent): void {
    const pointer = this.canvasPointToWorldSpace(Vector.fromMouseEvent(event));
    const tile = pointToTile(pointer);

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

  handlePointerMove(event: PointerEvent): void {
    const pointer = this.canvasPointToWorldSpace(Vector.fromMouseEvent(event));
    const tile = pointToTile(pointer);
    this.selection_hover = tile;
  }

  public drawWorld(context: CanvasRenderingContext2D) {
    // Clear screen
    context.fillStyle = 'green';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    context.lineWidth = 2;

    const drawer = this.game_state.getDrawer(context);
    drawer.draw_grid();
    drawer.draw_barriers();
    drawer.draw_shortest_path();
    drawer.draw_player();
    drawer.draw_finish();

    // Draw selection draft
    if (this.first_selection != null && this.selection_hover != null) {
      context.fillStyle = '#ff00003b';
      for (const [i, j] of orderedPairsOverArea(this.first_selection, this.selection_hover))
        context.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}

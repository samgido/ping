import { GameState } from "./game_objects";
import { DisplayDriver } from "./display_driver";
import { Vector } from "./vector";
import { UserType } from "./user_types/user_types";
import { MazeCreatorUser } from "./user_types/maze_creator";
import { MazePlayerUser } from "./user_types/maze_player";

class Game {
  display_driver: DisplayDriver
  user: UserType
  game_state: GameState
  context: CanvasRenderingContext2D

  last_frame_time: number = 0;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    const canvas = this.context.canvas;
    this.game_state = new GameState(new Vector(100, 100));

    this.user = new MazeCreatorUser(this.game_state);
    this.display_driver = new DisplayDriver(this.context);

    this.initEventListeners(canvas);

    window.addEventListener("resize", () => {
      this.resize();
    });
    this.resize();
  }

  public run() {
    this.draw(0);
  }

  private initEventListeners(canvas: HTMLCanvasElement) {
    canvas.addEventListener("pointerdown", (event) => {
      this.user.handlePointerDown(event);
    });

    canvas.addEventListener("pointermove", (event) => {
      this.user.handlePointerMove(event);
    });

    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case '1':
          this.user = new MazeCreatorUser(this.game_state);
          break;
        case '2':
          this.user = new MazePlayerUser(this.game_state);
          break;
        default:
          this.user.handleKeyDown(event);
      }
    });

    document.addEventListener("keyup", (event) => {
      this.user.handleKeyUp(event);
    });
  }

  private draw(t: number) {
    const delta_time = (t - this.last_frame_time) / 1000;
    this.last_frame_time = t;

    this.user.tick(delta_time);
    this.game_state.tick(delta_time);

    this.user.drawGame(this.context);

    requestAnimationFrame((new_time) => {
      this.draw(new_time);
    });
  }

  private resize() {
    this.display_driver.resize();
  }
}

const canvas = document.querySelector("#game_canvas") as HTMLCanvasElement || null;
if (canvas == null)
  throw new Error("Couldn't find canvas from document query");

const context = canvas.getContext("2d");
if (context == null)
  throw new Error("Couldn't get context from canvas");

const game = new Game(context);

game.run();

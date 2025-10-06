import { GameState } from "./game_objects";
import { DisplayDriver } from "./display_driver";
import { MazeCreator as MazeCreatorUser, UserType } from "./user";
import { Vector } from "./vector";

class Game {
  display_driver: DisplayDriver
  user: UserType

  constructor(context: CanvasRenderingContext2D) {
    const canvas = context.canvas;
    const game_state = new GameState(new Vector(100, 100));

    this.user = new MazeCreatorUser(game_state);
    this.display_driver = new DisplayDriver(context, game_state);

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

    document.addEventListener("keydown", (event) => {
      this.user.handleKeyDown(event);
    });
  }

  private draw(_: number) {
    this.display_driver.drawBoard();

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

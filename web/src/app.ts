import { DisplayDriver } from "./display_driver";
import { Vector } from "./vector";

class Game {
  display_driver: DisplayDriver

  constructor(context: CanvasRenderingContext2D) {
    const canvas = context.canvas;
    this.initEventListeners(canvas);

    this.display_driver = new DisplayDriver(context);

    window.addEventListener("resize", this.resize);
    this.resize();
  }

  public run() {
    this.draw(0);
  }

  private initEventListeners(canvas: HTMLCanvasElement) {
    canvas.addEventListener("pointerdown", (event) => {
      this.display_driver.handlePointerDown(new Vector(event.offsetX, event.offsetY));
    });
  }

  private draw(_: number) {
    this.display_driver.drawBoard();

    requestAnimationFrame((new_time) => {
      this.draw(new_time);
    })
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

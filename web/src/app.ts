class Game {
  x: number;
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.x = 0;
    this.context = context;
  }

  public run() {
    this.draw(0);
  }

  private draw(time: number) {
    this.context.fillStyle = "green";
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    this.context.fillStyle = "black";
    this.context.fillRect(this.x, 0, 10, 10);

    this.x += 1;

    requestAnimationFrame((new_time) => {
      this.draw(new_time);
    })
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

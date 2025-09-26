import { Board } from "./board";
import { Vector } from "./vector";

const TILE_SIZE = 10; // pixels ig

export class DisplayDriver {
  context: CanvasRenderingContext2D
  camera_offset: Vector = new Vector(0, 0);
  board: Board

  first_selection: Vector | null = null;

  constructor(context: CanvasRenderingContext2D) {
    this.board = new Board(new Vector(10, 10));
    this.context = context;
  }

  public drawBoard() {
    // Clear screen
    this.context.fillStyle = 'green';
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    // Draw board outline
    this.context.fillStyle = 'blue';
    this.context.lineWidth = 2;

    for (var i = 0; i < this.board.barriers.length; i++) {
      let p = this.board.barriers[i].mul(TILE_SIZE);

      this.context.strokeRect(p.x, p.y, TILE_SIZE, TILE_SIZE);
    }
  }

  public handlePointerDown(p: Vector) {
    let i_tile = Math.floor(p.x / TILE_SIZE);
    let j_tile = Math.floor(p.y / TILE_SIZE);

    let tile = new Vector(i_tile, j_tile);

    if (this.first_selection == null) {
      this.first_selection = tile;
    } else {
      this.board.addBarrierRect(this.first_selection, tile);

      this.first_selection = null;
    }

    console.log('Tile: (' + i_tile + ',' + j_tile + ')');
  }

  public resize() {
    const rect = this.context.canvas.parentElement!.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio;

    const screen = new Vector(rect.width, rect.height);
    this.context.canvas.style.width = `${screen.x}px`;
    this.context.canvas.style.height = `${screen.y}px`;

    const canvas_size = screen.mul(pixelRatio);


    this.context.canvas.width = canvas_size.x;
    this.context.canvas.height = canvas_size.y;
  }
}
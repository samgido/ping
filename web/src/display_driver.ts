import { Board } from "./board";
import { Vector } from "./vector";

const TILE_SIZE = 50; // pixels ig

export class DisplayDriver {
  context: CanvasRenderingContext2D
  camera_offset: Vector = new Vector(0, 0);
  board: Board

  player: Vector;
  finish: Vector;

  first_selection: Vector | null = null;

  constructor(context: CanvasRenderingContext2D) {
    this.board = new Board(new Vector(100, 100));
    this.context = context;

    this.player = new Vector(5, 15);
    this.finish = new Vector(10, 15);
  }

  public drawBoard() {
    // Clear screen
    this.context.fillStyle = 'green';
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    // Draw barriers
    this.context.lineWidth = 2;

    const getBoardValueOrFalse = (p: Vector) => this.board.getBoardValueOrDefault(false, p);
    for (var i = 0; i < this.board.size.x; i++) {
      for (var j = 0; j < this.board.size.y; j++) {
        if (this.board.grid[i][j]) {
          this.context.strokeStyle = 'blue';
          this.context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);

          this.context.strokeStyle = 'red';
          const c = 0;
          if (!getBoardValueOrFalse(new Vector(i - 1, j)))
            this.context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, c, TILE_SIZE);

          if (!getBoardValueOrFalse(new Vector(i + 1, j)))
            this.context.strokeRect((i + 1) * TILE_SIZE, j * TILE_SIZE, c, TILE_SIZE);

          if (!getBoardValueOrFalse(new Vector(i, j - 1)))
            this.context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, c);

          if (!getBoardValueOrFalse(new Vector(i, j + 1)))
            this.context.strokeRect(i * TILE_SIZE, (j + 1) * TILE_SIZE, TILE_SIZE, c);
        } else {
          this.context.strokeStyle = "gray";
          this.context.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    //Draw player
    this.context.fillStyle = 'purple';
    this.context.fillRect(this.player.x * TILE_SIZE, this.player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    //Draw finish
    this.context.fillStyle = 'white';
    this.context.fillRect(this.finish.x * TILE_SIZE, this.finish.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // Shortest path
    for (const p of this.board.shortest_path) {
      this.context.fillStyle = 'grey';
      this.context.fillRect(p.x * TILE_SIZE, p.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  public handlePathExists() {
    this.board.doesPathExist(this.player, this.finish);
  }

  public handleFindShortestPath() {
    this.board.getShortestPath(this.player, this.finish);
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

      this.board.shortest_path = this.board.getShortestPath(this.player, this.finish);
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

    this.context.scale(pixelRatio, pixelRatio);
  }
}
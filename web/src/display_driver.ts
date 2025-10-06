import { Vector } from "./vector";

export const TILE_SIZE = 25; // Units

export class DisplayDriver {
  context: CanvasRenderingContext2D

  camera_offset: Vector = new Vector(0, 0);
  camera_scale: number = 1;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
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

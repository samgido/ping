import { Vector } from "./vector";

export function* orderedPairs(size: Vector): Generator<[number, number]> {
  for (var i = 0; i < size.x; i++)
    for (var j = 0; j < size.y; j++)
      yield [i, j];
}

export function* orderedPairsOverArea(p1: Vector, p2: Vector): Generator<[number, number]> {
  const [v1, v2] = orderVectors(p1, p2);

  for (var i = 0; i < v2.x - v1.x + 1; i++)
    for (var j = 0; j < v2.y - v1.y + 1; j++)
      yield [i + v1.x, j + v1.y];
}

// Order vector components s.t. v1.x <= v2.x and v1.y <= v2.y
export function orderVectors(p1: Vector, p2: Vector): [Vector, Vector] {
  let x1 = Math.min(p1.x, p2.x);
  let y1 = Math.min(p1.y, p2.y);

  let x2 = Math.max(p1.x, p2.x);
  let y2 = Math.max(p1.y, p2.y);

  return [
    new Vector(x1, y1),
    new Vector(x2, y2)
  ];
}

export function canvasPointerToWorldSpace(pointer: Vector, camera_scale: number, camera_offset: Vector) {
  return new Vector(pointer.x, pointer.y).mul(1 / camera_scale).addVector(camera_offset);
}

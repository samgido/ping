import { Vector } from "./vector";

export function* orderedPairs(size: Vector): Generator<[number, number]> {
  for (var i = 0; i < size.x; i++)
    for (var j = 0; j < size.y; j++)
      yield [i, j];
}

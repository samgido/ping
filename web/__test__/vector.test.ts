import { Vector } from "../src/vector";

describe('Vector tests', () => {
  test('Multiplication', () => {
    const x = 1;
    const y = 2;
    const c = -1;

    var v = new Vector(x, y);

    v = v.mul(c);

    expect(v.x).toBe(c * x);
    expect(v.y).toBe(c * y);
  });
});
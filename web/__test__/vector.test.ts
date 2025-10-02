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

  test('Subtraction', () => {
    const u = new Vector(5, 6);
    const v = new Vector(5, 2);

    const u_minus_v = u.addVector(v);

    expect(u_minus_v.x).toBe(u.x + v.x);
    expect(u_minus_v.y).toBe(u.y + v.y);
  });
});
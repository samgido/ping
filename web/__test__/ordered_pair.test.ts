import { orderedPairs } from "../src/util";
import { Vector } from "../src/vector";

describe('Ordered pair generator test', () => {
  test('Elements', () => {
    const size = new Vector(10, 10);

    const pairs = orderedPairs(size);

    const elements: [number, number][] = [];
    for (const p of pairs) {
      expect(p[0]).toBeGreaterThanOrEqual(0);
      expect(p[0]).toBeLessThan(size.x);

      expect(p[1]).toBeGreaterThanOrEqual(0);
      expect(p[1]).toBeLessThan(size.y);

      elements.push(p);
    }

    expect(elements.length).toBe(size.x * size.y);
  });
});

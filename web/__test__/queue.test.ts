import { Queue } from "../src/data_structures";

describe('Queue test', () => {
  test('Pop', () => {
    const q = new Queue();

    q.push(1);
    q.push(2);
    q.push(3);

    expect(q.isEmpty()).toBe(false);

    expect(q.pop()).toBe(1);
    expect(q.pop()).toBe(2);
    expect(q.pop()).toBe(3);
    expect(q.pop()).toBeUndefined();

    expect(q.isEmpty()).toBe(true);
  });
});
import { MinHeap } from "../src/data_structures";

const numberCompare = (a: number, b: number) => a - b;
const numberGetKey = (a: number) => a.toString();

const makeMinHeap = () => new MinHeap<number, string>(numberCompare, numberGetKey);

describe('MinHeap tests', () => {
  test('New minheap should be empty', () => {
    const h = makeMinHeap();

    expect(h.size()).toBe(0);
  });

  test('Minheap keeps min value at the top', () => {
    const h = makeMinHeap();

    const c = 1;

    h.insert(c + 1);
    h.insert(c + 2);
    h.insert(c);

    expect(h.extractMin()).toBe(c);
    expect(h.extractMin()).toBe(c + 1);
    expect(h.extractMin()).toBe(c + 2);

    expect(h.extractMin()).toBeUndefined();
    expect(h.size()).toBe(0);
  });

  test('Minheap modify works', () => {
    const h = makeMinHeap();

    const c = 5;

    h.insert(c);
    h.insert(c + 1);
    h.insert(c + 2);

    h.logHeap();
    h.update(numberGetKey(c + 2), 3);
    h.logHeap();

    expect(h.extractMin()).toBe(3);
  });
});
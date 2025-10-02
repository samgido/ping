export class MinHeap<T, K> {
  private heap: T[] = [];
  private index_map: Map<K, number> = new Map();

  private readonly compare: (a: T, b: T) => number;
  private readonly getKey: (v: T) => K;

  constructor(
    compare: (a: T, b: T) => number,
    getKey: (v: T) => K
  ) {
    this.compare = compare;
    this.getKey = getKey;
  }

  public size(): number { 
    return this.heap.length; 
  }

  public logHeap() {
    console.log(this.heap);
  }

  public isEmpty(): boolean {
    return this.heap.length == 0;
  }

  public extractMin(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const min = this.heap[0];
    this.index_map.delete(this.getKey(min));

    if (this.size() == 1) {
      this.heap.pop();
      return min;
    }

    const last_item = this.heap.pop() as T;
    this.heap[0] = last_item;
    this.index_map.set(this.getKey(last_item), 0);

    this.bubbleDown(0);

    return min;
  }

  public update(k: K, v: T): boolean {
    const index = this.index_map.get(k);
    if (index == undefined) {
      console.log("Tried to update on key that isn't in indexmap");
      return false;
    }

    const old_item = this.heap[index];
    this.heap[index] = v;

    if (this.compare(v, old_item) < 0) {
      this.bubbleUp(index);
    } else
      this.bubbleDown(index);

    return true;
  }

  public get(k: K): T | undefined {
    const i = this.index_map.get(k);
    if (i == undefined)
      return undefined;

    if (i < 0 || i >= this.size())
      return undefined;

    return this.heap[i];
  }

  public insert(e: T) {
    const key = this.getKey(e);

    if (this.index_map.get(key) != undefined) {
      console.log("Tried to insert an element that already exists");
      console.log("Key attempted: " + key);
      return;
    }

    this.heap.push(e);
    const new_index = this.size() - 1;
    this.index_map.set(key, new_index);
    this.bubbleUp(new_index);
  }

  private getParentIndex(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private getLeftChildIndex(i: number): number {
    return 2 * i + 1;
  }

  private getRightChildIndex(i: number): number {
    return 2 * i + 2;
  }

  private swap(i: number, j: number) {
    const i_val = this.heap[i];
    const j_val = this.heap[j];

    [this.heap[i], this.heap[j]] = [j_val, i_val];

    this.index_map.set(this.getKey(i_val), j);
    this.index_map.set(this.getKey(j_val), i);
  }

  private bubbleUp(i: number) {
    let current_index = i;
    let parent_index = this.getParentIndex(current_index);

    while (current_index > 0 && this.compare(this.heap[current_index], this.heap[parent_index]) < 0) {
      this.swap(current_index, parent_index);
      current_index = parent_index;
      parent_index = this.getParentIndex(current_index);
    }
  }

  private bubbleDown(i: number) {
    let current_index = i;
    let last_index = this.size() - 1;

    var i = 0;

    while (true) {
      const left_child_index = this.getLeftChildIndex(current_index);
      const right_child_index = this.getRightChildIndex(current_index);
      let smallest_index = current_index;

      if (left_child_index <= last_index && this.compare(this.heap[left_child_index], this.heap[smallest_index]) < 0) {
        smallest_index = left_child_index;
      }

      if (right_child_index <= last_index && this.compare(this.heap[right_child_index], this.heap[smallest_index]) < 0) {
        smallest_index = right_child_index;
      }

      if (current_index == smallest_index) {
        break;
      }

      this.swap(current_index, smallest_index);
      current_index = smallest_index;

      i += 1;
    }
  }
}
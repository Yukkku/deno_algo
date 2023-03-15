import { defaultConpare, type Heap } from '../util.ts';

/**
 * 二分ヒープの実装。デフォルトではmin-heapになっている
 */
export class BinaryHeap<T> implements Heap<T> {
  #data: [null, ...T[]] = [null];
  #compare: (a: T, b: T) => number;

  get size(): number {
    return this.#data.length - 1;
  }

  constructor (compareFunc: (a: T, b: T) => number = defaultConpare) {
    this.#compare = compareFunc;
  }

  insert (...items: T[]) {
    let i = this.#data.length;
    this.#data.push(...items);

    for (; i < this.#data.length; i += 1) {
      this.#upHeap(i);
    }

    return this.size;
  }

  clear () {
    this.#data = [null];
  }

  delete () {
    if (this.size === 0) {
      return;
    }
    if (this.size === 1) {
      return <T>this.#data.pop();
    }

    const retVal = this.#data[1];
    this.#data[1] = <T>this.#data.pop();

    this.#downHeap(1);

    return retVal;
  }

  find (): T|undefined {
    return this.#data[1];
  }

  #upHeap (idx: number) {
    if (idx <= 1) return;

    const parent = idx >>> 1;

    if (this.#compare(<T>this.#data[idx], <T>this.#data[parent]) < 0) {
      const tmp = <T>this.#data[idx];
      this.#data[idx] = <T>this.#data[parent];
      this.#data[parent] = tmp;

      this.#upHeap(parent);
    }
  }

  #downHeap (idx: number) {
    if (idx * 2 < this.#data.length) {
      let comi: number;
      if (idx * 2 + 1 < this.#data.length
        && this.#compare(<T>this.#data[idx * 2], <T>this.#data[idx * 2 + 1]) > 0
      ) {
        comi = idx * 2 + 1;
      } else {
        comi = idx * 2;
      }

      if (this.#compare(<T>this.#data[idx], <T>this.#data[comi]) > 0) {
        const tmp = <T>this.#data[comi];
        this.#data[comi] = this.#data[idx];
        this.#data[idx] = tmp;
        this.#downHeap(comi);
      }
    }
  }
}

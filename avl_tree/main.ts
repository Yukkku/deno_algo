"use strict";

function assert (_: boolean): asserts _ {}

/** `[ルート要素, 高さ, 大きさ, 左の子, 右の子]` */
type NonNullNode<T> = [T, number, number, Node<T>, Node<T>];
type Node<T> = NonNullNode<T> | null;

const defaultConpare = <T>(a: T, b: T) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

const add = <T>(node: NonNullNode<T>, val: T, compare: (a: T, b: T) => number): boolean => {
  const diff = compare(val, node[0]);

  if (diff > 0) {
    if (node[4]) {
      if (add<T>(node[4], val, compare)) return true;
    } else {
      node[4] = [
        val,
        1,
        1,
        null,
        null,
      ];
    }
  } else if (diff < 0) {
    if (node[3]) {
      if (add<T>(node[3], val, compare)) return true;
    } else {
      node[3] = [
        val,
        1,
        1,
        null,
        null,
      ];
    }
  } else {
    return true;
  }

  rot(node);

  return false;
};

const del = <T>(node: NonNullNode<T>, val: T, compare: (a: T, b: T) => number): boolean => {
  const diff = compare(val, node[0]);

  if (diff > 0) {
    if (node[4]) {
      if (node[4][2] === 1) {
        if (compare(node[4][0], val) == 0) {
          node[4] = null;
        } else {
          return false;
        }
      } else {
        if (!del(node[4], val, compare)) return false;
      }
    } else {
      return false;
    }
  } else if (diff < 0) {
    if (node[3]) {
      if (node[3][2] === 1) {
        if (compare(node[3][0], val) == 0) {
          node[3] = null;
        } else {
          return false;
        }
      } else {
        if (!del(node[3], val, compare)) return false;
      }
    } else {
      return false;
    }
  } else {
    if (node[4]) {
      if (node[4][2] === 1) {
        node[0] = node[4][0];
        node[4] = null;
      } else {
        node[0] = delAt(node[4], 0);
      }
    } else if (node[3]) {
      node[0] = node[3][0];
      node[3] = null;
    } else {
      return true;
    }
  }

  rot(node);
  return true;
};

function delAt <T>(node: NonNullNode<T>, idx: 0): T;
function delAt <T>(node: NonNullNode<T>, idx: -1): T;
function delAt <T>(node: null, idx: number): undefined;
function delAt <T>(node: NonNullNode<T>, idx: number): T | undefined;
function delAt <T>(node: Node<T>, idx: number): T | undefined {
  if (node === null) {
    return;
  }

  if (idx < 0) {
    idx += node[2];

    if (idx < 0) return;
  }

  let retVal: T | undefined;
  const lSize = node[3]?.[2] ?? 0;

  if (idx > lSize) {
    if (node[4]) {
      if (node[4][2] === 1) {
        if (idx === lSize + 1) {
          retVal = node[4][0];
          node[4] = null;
        } else {
          return;
        }
      } else {
        retVal = delAt(node[4], idx - lSize - 1);
      }
    } else {
      return;
    }
  } else if (idx < lSize) {
    if (node[3]) {
      if (node[3][2] === 1) {
        if (idx === 0) {
          retVal = node[3][0];
          node[3] = null;
        } else {
          return;
        }
      } else {
        retVal = delAt(node[3], idx);
      }
    } else {
      return;
    }
  } else {
    if (node[4]) {
      retVal = node[0];
      if (node[4][2] === 1) {
        node[0] = node[4][0];
        node[4] = null;
      } else {
        node[0] = delAt(node[4], 0);
      }
    } else if (node[3]) {
      node[0] = node[3][0];
      node[3] = null;
    } else {
      return node[0];
    }
  }

  rot(node);
  return retVal;
}

function at <T>(node: Node<T>, idx: number): T | undefined {
  if (node === null) {
    return;
  }

  if (idx < 0) {
    idx += node[2];

    if (idx < 0) return;
  }

  const lSize = node[3]?.[2] ?? 0;

  if (idx > lSize) {
    at(node[4], idx - lSize - 1);
  } else if (idx < lSize) {
    at(node[3], idx);
  } else {
    return node[0];
  }
}

const has = <T>(node: Node<T>, val: T, compare: (a: T, b: T) => number): boolean => {
  if (node === null) {
    return false;
  }

  const diff = compare(val, node[0]);

  if (diff > 0) {
    return has<T>(node[4], val, compare);
  } else if (diff < 0) {
    return has<T>(node[3], val, compare);
  } else {
    return true;
  }
};

const rot = <T>(node: NonNullNode<T>) => {
  const heightDiff = (node[3]?.[1] ?? 0) - (node[4]?.[1] ?? 0);

  if (heightDiff > 1) {
    assert(node[3] !== null);
    const lHeightDiff = (node[3][3]?.[1] ?? 0) - (node[3][4]?.[1] ?? 0);

    if (lHeightDiff < 0) {
      assert(node[3][4] !== null);
      // lr case
      node[4] = [
        node[0],
        Math.max(node[3][4][4]?.[1] ?? 0, node[4]?.[1] ?? 0) + 1,
        (node[3][4][4]?.[2] ?? 0) + (node[4]?.[2] ?? 0) + 1,
        node[3][4][4],
        node[4],
      ];
      node[0] = node[3][4][0];
      node[3][1] -= 1;
      node[3][2] -= (node[3][4][4]?.[2] ?? 0) + 1;
      node[3][4] = node[3][4][3];
    } else {
      // ll case
      node[4] = [
        node[0],
        Math.max(node[3][4]?.[1] ?? 0, node[4]?.[1] ?? 0) + 1,
        (node[3][4]?.[2] ?? 0) + (node[4]?.[2] ?? 0) + 1,
        node[3][4],
        node[4],
      ];
      node[0] = node[3][0];
      node[3] = node[3][3];
    }
  } else if (heightDiff < -1) {
    assert(node[4] !== null);
    const rHeightDiff = (node[4][3]?.[1] ?? 0) - (node[4][4]?.[1] ?? 0);

    if (rHeightDiff > 0) {
      assert(node[4][3] !== null);
      // rl case
      node[3] = [
        node[0],
        Math.max(node[3]?.[1] ?? 0, node[4][3][3]?.[1] ?? 0) + 1,
        (node[3]?.[2] ?? 0) + (node[4][3][3]?.[2] ?? 0) + 1,
        node[3],
        node[4][3][3],
      ];
      node[0] = node[4][3][0];
      node[4][1] -= 1;
      node[4][2] -= (node[4][3][3]?.[2] ?? 0) +1;
      node[4][3] = node[4][3][4];
    } else {
      // rr case
      node[3] = [
        node[0],
        Math.max(node[3]?.[1] ?? 0, node[4][3]?.[1] ?? 0) + 1,
        (node[3]?.[2] ?? 0) + (node[4][3]?.[2] ?? 0) + 1,
        node[3],
        node[4][3],
      ];
      node[0] = node[4][0];
      node[4] = node[4][4];
    }
  }

  node[1] = Math.max(node[3]?.[1] ?? 0, node[4]?.[1] ?? 0) + 1;
  node[2] = (node[3]?.[2] ?? 0) + (node[4]?.[2] ?? 0) + 1;
};

export class AVLTree<T> implements Set<T> {
  #root: Node<T> = null;
  #compare: (a: T, b: T) => number;

  constructor (compareFunc: (a: T, b: T) => number = defaultConpare) {
    this.#compare = compareFunc;
  }

  add (value: T) {
    if (!this.#root) {
      this.#root = [value, 1, 1, null, null];
      return this;
    }

    add<T>(this.#root, value, this.#compare);

    return this;
  }

  clear () {
    this.#root = null;
  }

  delete (value: T): boolean {
    if (this.#root) {
      if (this.#root[2] === 1) {
        if (this.#compare(this.#root[0], value) == 0) {
          this.#root = null;
          return true;
        }

        return false;
      }

      return del(this.#root, value, this.#compare);
    }

    return false;
  }

  forEach (callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: unknown): void {
    for (const val of this[Symbol.iterator]()) {
      callbackfn.call(thisArg ,val, val, this);
    }
  }

  has (value: T): boolean {
    return has(this.#root, value, this.#compare);
  }

  get size () {
    return this.#root?.[2] ?? 0;
  }

  *entries (): IterableIterator<[T, T]> {
    for (const val of this[Symbol.iterator]()) {
      yield [val, val];
    }
  }

  keys (): IterableIterator<T> {
    return this[Symbol.iterator]();
  }

  values (): IterableIterator<T> {
    return this[Symbol.iterator]();
  }

  *[Symbol.iterator] () {
    const n = [this.#root];
    const m = [0];
    let i = 0;

    while (n.length > 0) {
      m[i] += 1;
      const q = n[i];

      if (q === null) {
        n.pop();
        m.pop();
        i -= 1;
      } else {
        if (m[i] === 1) {
          n.push(q[3]);
          m.push(0);
          i += 1;
        } else if (m[i] === 2) {
          yield q[0];
          n.push(q[4]);
          m.push(0);
          i += 1;
        } else {
          n.pop();
          m.pop();
          i -= 1;
        }
      }
    }
  }

  get [Symbol.toStringTag] () {
    return 'AVLTree';
  }

  at (index: number): T | undefined {
    return at(this.#root, index);
  }

  deleteAt (index: number): T | undefined {
    if (this.#root) {
      if (this.#root[2] === 1) {
        if (index === 0 || index === -1) {
          const retVal = this.#root[0];
          this.#root = null;
          return retVal;
        }

        return;
      }

      return delAt(this.#root, index);
    }

    return;
  }
}

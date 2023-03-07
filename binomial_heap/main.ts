"use strict";

const defaultConpare = <T>(a: T, b: T) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

type BinomialTree<T> = [T, ...BinomialTree<T>[]];

/**
 * 二項ヒープの実装
 */
export class BinomialHeap<T> {
  #data: []|[...(BinomialTree<T>|undefined)[], BinomialTree<T>] = [];
  #compare: (a: T, b: T) => number;
  #size = 0;

  get size () {
    return this.#size;
  }

  /**
   * @param compareFunc 比較する関数。デフォルトでは`(a, b) => a - b`
   */
  constructor (compareFunc: (a: T, b: T) => number = defaultConpare) {
    this.#compare = compareFunc;
  }

  /**
   * 要素を追加する
   * @param items 追加する要素
   * @returns 追加後のヒープの要素数
   */
  push (...items: T[]) {
    this.#size += items.length;

    items.forEach(item => {
      let v: BinomialTree<T> = [item];
      let i = 0;

      for(; this.#data[i]; i += 1) {
        const r = this.#data[i] as BinomialTree<T>;
        this.#data[i] = undefined;
        if (this.#compare(r[0], v[0]) < 0) {
          r.push(v);
          v = r;
        } else {
          v.push(r);
        }
      }

      this.#data[i] = v;
    });
  }

  /**
   * 最も優先される要素を削除し、その要素を返す。要素がないなら何もせず、`undefined`を返す
   * @returns 最優先の要素、または`undefined`
   */
  pop () {
    if (this.#size === 0) {
      return;
    }

    this.#size -= 1;

    let peak = this.#data.length - 1;

    let peaktree = this.#data.at(-1) as BinomialTree<T>;

    for (let i = this.#data.length - 2; i >= 0; i -= 1) {
      const t = this.#data[i];

      if (t) {
        if (this.#compare(peaktree[0], t[0]) >= 0) {
          peaktree = t;
          peak = i;
        }
      }
    }

    if (peak === this.#data.length - 1) {
      this.#data.pop();
    } else {
      this.#data[peak] = undefined;
    }

    let moveUp: BinomialTree<T>|undefined = undefined;

    for (let i = 1; i < peaktree.length; i += 1) {
      const q = this.#data[i - 1];
      const p = peaktree[i] as BinomialTree<T>;

      if (q) {
        if (moveUp) {
          if (this.#compare(p[0], moveUp[0]) >= 0) {
            moveUp.push(p);
          } else {
            p.push(moveUp);
            moveUp = p;
          }
        } else {
          if (this.#compare(p[0], q[0]) >= 0) {
            q.push(p);
            this.#data[i - 1] = undefined;
            moveUp = q;
          } else {
            p.push(q);
            this.#data[i - 1] = undefined;
            moveUp = p;
          }
        }
      } else {
        if (moveUp) {
          if (this.#compare(p[0], moveUp[0]) >= 0) {
            moveUp.push(p);
          } else {
            p.push(moveUp);
            moveUp = p;
          }
        } else {
          this.#data[i - 1] = p;
        }
      }
    }

    let i = peaktree.length - 1;

    while (moveUp) {
      if (this.#data[i]) {
        const c = this.#data[i] as BinomialTree<T>;
        this.#data[i] = undefined;

        if (this.#compare(c[0], moveUp[0]) >= 0) {
          moveUp.push(c);
        } else {
          c.push(moveUp);
          moveUp = c;
        }
      } else {
        this.#data[i] = moveUp;
        moveUp = undefined;
      }

      i += 1;
    }

    return peaktree[0];
  }

  /**
   * 最も優先される要素を返す。要素がないなら`undefined`を返す
   * @returns 最優先の要素、または`undefined`
   */
  peak (): T|undefined {
    if (this.#size === 0) {
      return;
    }
    let peak = (this.#data.at(-1) as BinomialTree<T>)[0];

    for (let i = this.#data.length - 2; i >= 0; i -= 1) {
      const t = this.#data[i];

      if (t) {
        if (this.#compare(peak, t[0]) >= 0) {
          peak = t[0];
        }
      }
    }
  }
}

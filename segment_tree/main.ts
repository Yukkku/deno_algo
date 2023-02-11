"use strict";

interface SegTreeConstructor<T> extends ArrayConstructor {
  new (...i: T[] | [number]): SegTree<T>;
  prototype: SegTree<T>;
  op: (a: T, b: T) => T;
  e: T;
}

interface SegTree<T> extends Array<T> {
  constructor: SegTreeConstructor<T>;
  roots?: SegTree<T>;
  prod (a: number, b: number): T
}

/**
 * セグ木のクラスを作る関数です。
 * @param op モノイドの演算
 * @param e モノイドの単位元
 */
const SegTree = <T>(op: (a: T, b: T) => T, e: T): SegTreeConstructor<T> => {
  const SegTree = (class extends Array<T> {
    static op = op;
    static e = e;

    roots?: SegTree<T>;
  
    constructor () {
      super(...arguments);

      if (this.length >= 2) {
        this.roots = new SegTree();

        for (let i = 1; i < this.length; i += 2) {
          this.roots.push(op(this[i - 1], this[i]));
        }
      }

      return new Proxy(this, {
        get (target, p) {
          if (typeof p === 'string' && !Number.isNaN(Number(p))) {
            if (!Object.hasOwn(target, p)) {
              return e;
            }
          }
  
          return target[p as keyof SegTree<T>];
        },
  
        set (target, p, val) {
          target[p as keyof SegTree<T>] = val;

          if (typeof p === 'string' && !Number.isNaN(Number(p))) {
            const index = Number(p);
        
            if (target.length > 1) {
              if (target.roots === undefined) {
                target.roots = new SegTree();
              }
        
              const rootIndex = index >> 1;
        
              if ((index & 1) === 1 || index + 1 !== target.length) {
                target.roots[rootIndex] = SegTree.op(target[rootIndex << 1], target[(rootIndex << 1) + 1]);
              }
            }
          } else {
            if (p === 'length') {
              if (target.roots !== undefined) {
                target.roots.length = Number(val) >> 1;
              }
            }
          }
  
          return true;
        },
      });
    }

    /**
     * モノイドだと信じて[bigin, end)の範囲で計算
     * @param bigin 区間の左端(含む)
     * @param end 区間の右端(含まない)
     */
    prod(bigin: number, end: number) {
      if (bigin < 0) {
        bigin = 0;
      }

      if (end > this.length) {
        end = this.length;
      }

      let retVal = SegTree.e;
  
      if (bigin >= end) {
        return retVal;
      }
  
      if (bigin & 1) {
        retVal = this[bigin];
        bigin += 1;
      }
  
      if (this.roots !== undefined) {
        retVal = SegTree.op(retVal, this.roots.prod(bigin >> 1, end >> 1));
      }
  
      if (end & 1) {
        retVal = SegTree.op(retVal, this[end - 1]);
      }
  
      return retVal;
    }
  }) as unknown as SegTreeConstructor<T>;

  return SegTree;
}

/**
 * 範囲の和を計算するセグ木
 */
SegTree.sum = SegTree<number>(
  (a: number, b: number) => a + b,
  0,
);

/**
 * 範囲の最小値を計算するセグ木
 */
SegTree.min = SegTree<number>(
  Math.min,
  Infinity,
);

/**
 * 範囲の最大値を計算するセグ木
 */
SegTree.max = SegTree<number>(
  Math.max,
  -Infinity,
);

/**
 * 範囲のビット排他的論理和を計算するセグ木
 */
SegTree.xor = SegTree<number>(
  (a: number, b: number) => a ^ b,
  0,
);

export { SegTree };

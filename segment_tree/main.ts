"use strict";

type group<T> = {
  e: T,
  op: (a: T, b: T) => T,
}

/**
 * SegmentTreeの実装。ArrayとProxyを用いて可変長なものになっている。
 * constructor以外の新しいSegmentTreeを返すメソッドを使うとバグるので注意。
 */
export class SegmentTree<T> extends Array<T> {
  /** モノイドの演算 */
  public op: (a: T, b: T) => T;
  /** モノイドの単位元 */
  public e: T;
  /** 半分の長さを持つこの配列の根のセグ木 */
  private roots?: SegmentTree<T>;

  constructor (op: (a: T, b: T) => T, e: T) {
    super();
    this.op = op;
    this.e = e;

    return new Proxy(this, {
      set (target, p, newValue) {
        target[p as keyof SegmentTree<T>] = newValue;
  
        if (typeof p === "string" && !Number.isNaN(Number(p)) && target.length > 1) {
          if (target.roots === undefined) {
            target.roots = new SegmentTree<T>(op, e);
          }
  
          const index = Number(p);
          const rootIndex = index >> 1;
  
          if ((index & 1) === 1 || index + 1 !== target.length) {
            target.roots[rootIndex] = op(target[rootIndex << 1], target[(rootIndex << 1) + 1]);
          }
        } else if (p === "length") {
          if (target.roots !== undefined) {
            target.roots.length = (newValue as number) >> 1;
          }
        }
  
        return true;
      },
    });
  }

  /**
   * 区間[bigin, end)にopを適用させた結果を返す。
   * @param bigin 区間の始め(含む)
   * @param end 区間の終わり(含まない)
   */
  prod(bigin: number, end: number): T  {
    if (bigin >= end) {
      return this.e;
    }

    let retVal = this.e;

    if (bigin & 1) {
      retVal = this[bigin];
      bigin += 1;
    }

    if (this.roots !== undefined) {
      retVal = this.op(retVal, this.roots.prod(bigin >> 1, end >> 1));
    }

    if (end & 1) {
      end -= 1;
      retVal = this.op(retVal, this[end]);
    }

    return retVal;
  }
}

const e = new SegmentTree<number>(Math.min,Infinity);
e.push(1,2,3,4,5);
console.log(e.concat(1,2,3).constructor);

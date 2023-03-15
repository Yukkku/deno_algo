/**
 * Sparse Tableの実装
 */
export class SparseTable<T> {
  #table: T[][];
  #op: (a: T, b: T) => T;

  /**
   * @param op 使用する演算。結合性と冪等性が必要
   * @param data クエリを適用する配列
   */
  constructor (op: (a: T, b: T) => T, data: ArrayLike<T>) {
    this.#table = [];
    this.#op = op;

    let last = Array.from(data);
    let length = 1;
    this.#table.push(last);

    while (length < last.length) {
      const n: T[] = [];

      for (let i = length; i < last.length; i += 1) {
        n.push(op(last[i - length], last[i]));
      }

      this.#table.push(n);
      last = n;
      length *= 2;
    }
  }

  /**
   * 区間積を求める
   * @param bigin 区間の開始位置(含む)
   * @param end 区間の終了位置(含まない)
   * @returns `[bigin, end)`の総積
   */
  query (bigin: number, end: number): T {
    const w = end - bigin;
    let i = 0;
    let j = 2;

    while (j <= w) {
      i += 1;
      j *= 2;
    }

    j /= 2;

    if (j === w) {
      return this.#table[i][bigin];
    }

    return this.#op(this.#table[i][bigin], this.#table[i][end - j]);
  }
}

/**
 * Segment Treeの実装
 */
export class SegmentTree<T> {
  #e: T;
  #op: (a: T, b: T) => T;
  #data: T[];

  /**
   * SegmentTreeは`e`で初期化される
   * @param e モノイドの単位元
   * @param op モノイドの演算
   * @param length SegmentTreeの要素数
   */
  constructor (e: T, op: (a: T, b: T) => T, length: number);

  /**
   * @param e モノイドの単位元
   * @param op モノイドの演算
   * @param array SegmentTreeの初期値
   */
  constructor (e: T, op: (a: T, b: T) => T, array: T[]);

  constructor (e: T, op: (a: T, b: T) => T, input: number | T[]) {
    this.#e = e;
    this.#op = op;

    if (typeof input === 'number') {
      let length = 1;

      while (length * 2 < input) {
        length *= 2;
      }

      this.#data = [];

      for (let i = 0; i < length; i += 1) {
        this.#data.push(e);
      }

      return;
    }

    let size = 1;

    while (size < input.length) {
      size *= 2;
    }

    const notReaf: T[] = [];

    for (let i = 0; i < size; i += 1) {
      notReaf.push(e);
    }

    this.#data = notReaf.concat(input);

    for (let i = input.length; i < size; i += 1) {
      notReaf.push(e);
    }

    for (let i = size - 1; i > 0; i -= 1) {
      this.#data[i] = op(this.#data[i * 2], this.#data[i * 2 + 1]);
    }
  }

  /**
   * 要素の更新を行う
   * @param index 更新する要素のindex
   * @param value 更新後の値
   */
  set (index: number, value: T) {
    const i = index + this.#data.length / 2;
    this.#data[i] = value;

    while (i > 1) {
      i >>> 1;
      this.#data[i] = this.#op(this.#data[i * 2], this.#data[i * 2 + 1]);
    }
  }

  /**
   * 区間積を計算する
   * @param bigin 区間の開始位置(含む)
   * @param end 区間の終了位置(含まない)
   * @returns `[bigin, end)`の総積
   */
  query (bigin: number, end: number) {
    const size = this.#data.length / 2;
    let left = this.#e;
    let right = this.#e;

    bigin += size;
    end += size;

    while (bigin < end) {
      if (bigin & 1) {
        left = this.#op(left, this.#data[bigin]);
        bigin += 1;
      }
      if (end & 1) {
        end -= 1;
        right = this.#op(this.#data[end], right);
      }
      bigin >>>= 1;
      end >>>= 1;
    }

    return this.#op(left, right);
  }
}

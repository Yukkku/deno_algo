"use strict";

/**
 * `[データ, 前の要素のポインタ, 後ろの要素のポインタ]` の構造
 */
type Pointer<T> = [T, Pointer<T>, Pointer<T>] | null;

/**
 * Doubly Linked Listの実装。
 */
export class LinkedList<T> {

  #length = 0;
  /**
   * 要素の総数を取得する。
   */
  get length () {
    return this.#length;
  }

  #first: Pointer<T> = null;
  #last: Pointer<T> = null;

  /**
   * @param items 最初に入ってる要素。
   */
  constructor (...items: T[]) {
    this.push(...items);
  }

  /**
   * 要素を末尾に追加して、追加後の要素数を返します。
   * @param items 追加する要素。複数指定できます。
   */
  push (...items: T[]) {
    items.forEach(item => {
      if (this.#last === null) {
        this.#last = [item, null, null];
        this.#first = this.#last;
      } else {
        const newend: Pointer<T> = [item, this.#last, null];
        this.#last[2] = newend;
        this.#last = newend;
      }
    });

    this.#length += items.length;
    return this.#length;
  }

  /**
   * 末尾の要素を削除して、その要素を返す。
   * 要素がなかった場合は何もせずに`undefined`を返す。
   */
  pop () {
    if (this.#last === null) {
      return;
    }

    const retVal: T = this.#last[0];
    this.#last = this.#last[1];
    this.#length -= 1;

    if (this.#last === null) {
      this.#first = null;
    } else {
      this.#last[2] = null;
    }

    return retVal;
  }

  /**
   * 末尾の要素を返す。要素がない場合は`undefined`を返す。
   */
  last () {  
    return this.#last?.[0];
  }

  /**
   * 要素を順番を保ったまま先頭に追加して、追加後の要素数を返す。
   * @param 追加する要素
   * @returns 追加後の要素数
   */
  unshift (...items: T[]) {
    items.reverse().forEach(item => {
      if (this.#first === null) {
        this.#first = [item, null, null];
        this.#last = this.#first;
      } else {
        const newstart: Pointer<T> = [item, this.#last, null];
        this.#first[2] = newstart;
        this.#first = newstart;
      }
    });

    this.#length += items.length;
    return this.#length;
  }

  /**
   * 先頭の要素を削除して、その要素を返す。
   * 要素がなかった場合は何もせずに`undefined`を返す。
   */
  shift () {
    if (this.#first === null) {
      return;
    }

    const retVal: T = this.#first[0];
    this.#first = this.#first[2];
    this.#length -= 1;

    if (this.#first === null) {
      this.#last = null;
    } else {
      this.#first[1] = null;
    }

    return retVal;
  }

  /**
   * 先頭の要素を返す。要素がない場合は`undefined`を返す。
   */
  first () {
    return this.#first?.[0];
  }

  *[Symbol.iterator] () {
    let pointer = this.#first;
    while (pointer !== null) {
      yield pointer[0];
      pointer = pointer[2];
    }
  }
}

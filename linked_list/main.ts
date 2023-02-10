"use strict";

/**
 * `[データ, 前の要素のポインタ, 後ろの要素のポインタ]` という構造
 */
type pointer<T> = [T, pointer<T>, pointer<T>] | null;

/**
 * Doubly Linked Listの実装です。両端キューとかができます。
 * 基本的にArrayの仕様を模倣してます。
 */
export class LinkedList<T> {
  /** 要素の総数を取得します。書き込みはできません。 */
  public length = 0;
  /** 最初の要素のポインタ */
  private firstPointer: pointer<T> = null;
  /** 最後の要素のポインタ */
  private lastPointer: pointer<T> = null;

  /**
   * @param items 最初に入ってる要素。
   */
  constructor (...items: T[]) {
    this.push(...items);
  }

  /**
   * 要素を末尾に追加して、追加後の要素数を返します。
   * @param 追加する要素。複数指定できます。
   */
  public push (...items: T[]) {
    items.forEach(item => {
      if (this.lastPointer === null) {
        this.lastPointer = [item, null, null];
        this.firstPointer = this.lastPointer;
      } else {
        const newend: pointer<T> = [item, this.lastPointer, null];
        this.lastPointer[2] = newend;
        this.lastPointer = newend;
      }
    });

    this.length += items.length;
    return this.length;
  }

  /**
   * 末尾の要素を削除して、その要素を返します。
   * 末尾に要素がなかった場合は何もせずにundefinedを返す。
   */
  public pop () {
    if (this.lastPointer === null) {
      return;
    }

    const retVal: T = this.lastPointer[0];
    this.lastPointer = this.lastPointer[1];
    this.length -= 1;

    if (this.lastPointer === null) {
      this.firstPointer = null;
    } else {
      this.lastPointer[2] = null;
    }

    return retVal;
  }

  /**
   * 末尾の要素を返します。
   */
  public last () {
    if (this.lastPointer === null) {
      return;
    }
  
    return this.lastPointer[0];
  }

  /**
   * 要素を順番を保ったまま先頭に追加して、追加後の要素数を返します。
   * @param 追加する要素。複数指定できます。
   */
  public unshift (...items: T[]) {
    items.reverse().forEach(item => {
      if (this.firstPointer === null) {
        this.firstPointer = [item, null, null];
        this.lastPointer = this.firstPointer;
      } else {
        const newstart: pointer<T> = [item, this.lastPointer, null];
        this.firstPointer[2] = newstart;
        this.firstPointer = newstart;
      }
    });

    this.length += items.length;
    return this.length;
  }

  /**
   * 先頭の要素を削除して、その要素を返します。
   * 先頭に要素がなかった場合は何もせずにundefinedを返す。
   */
  public shift () {
    if (this.firstPointer === null) {
      return;
    }

    const retVal: T = this.firstPointer[0];
    this.firstPointer = this.firstPointer[2];
    this.length -= 1;

    if (this.firstPointer === null) {
      this.lastPointer = null;
    } else {
      this.firstPointer[1] = null;
    }

    return retVal;
  }

  /**
   * 先頭の要素を返します。
   */
  public first () {
    if (this.firstPointer === null) {
      return;
    }
  
    return this.firstPointer[0];
  }

  /**
   * 何の変哲もないイテレータです。
   * これのお陰でスプレッド構文が使えます。
   */
  public *[Symbol.iterator] () {
    let tmp = this.firstPointer;
    while (tmp !== null) {
      yield tmp[0];
      tmp = tmp[2];
    }
  }
}

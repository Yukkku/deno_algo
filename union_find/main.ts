/**
 * Union Findの実装
 */
export class UnionFind {
  /** 木の親の要素。根の場合は-(木の大きさ)になる */
  #parent: number[];
  /** 経路圧縮しなかった場合の木の高さ */
  #height: number[];

  /**
   * @param n 要素数の上限
   */
  constructor (n: number) {
    this.#parent = [...Array(n)].fill(-1);
    this.#height = [...Array(n)].fill(1);
  }

  /**
   * 要素の根を探す
   * @param a 調べたい要素の番号
   * @returns 根の番号
   */
  root (a: number): number {
    const parent = this.#parent[a];

    if (parent < 0) {
      return a;
    }

    const root = this.root(parent);
    this.#parent[a] = root;
    return root;
  }

  /**
   * aとbが属するグループを1つに合体する
   * @param a
   * @param b
   * @returns 新しいグループの根
   */
  marge (a: number, b: number): number {
    const aRoot = this.root(a);
    const bRoot = this.root(b);

    if (aRoot === bRoot) {
      return aRoot;
    }

    if (this.#height[aRoot] > this.#height[bRoot]) {
      this.#parent[bRoot] += this.#parent[aRoot];
      this.#parent[aRoot] = bRoot;
      return bRoot;
    } else {
      this.#parent[aRoot] += this.#parent[bRoot];
      this.#parent[bRoot] = aRoot;

      if (this.#height[aRoot] === this.#height[bRoot]) {
        this.#height[aRoot] += 1;
      }
      return aRoot;
    }
  }

  /**
   * aの所属するグループのサイズを調べる
   * @param a
   * @returns グループのサイズ
   */
  size (a: number): number {
    return -this.#parent[this.root(a)];
  }

  /**
   * aとbが同じグループに属しているか調べる
   * @param a
   * @param b
   * @returns 同じグループに属しているか判定
   */
  same (a: number, b: number): boolean {
    return this.root(a) === this.root(b);
  }
}

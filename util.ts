/** 
 * ヒープとかのデフォルトの比較する関数。
 */
export function defaultConpare <T>(a: T, b: T): number {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

/**
 * アサ―ト関数。TypeScriptの型を制御するのに使う。
 */
export function assert (condition: boolean): asserts condition {
  if (!condition) {
    throw new Error('deno_algoのバグです。私(Yukkku)に連絡ください。');
  }
}

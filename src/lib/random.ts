/**
 * Pick one element from a non-empty array using crypto.getRandomValues.
 * Rejection-sampled so the distribution is unbiased even when array length
 * does not divide 2^32.
 */
export function pickWinner<T>(items: readonly T[]): { winner: T; index: number } {
  if (items.length === 0) {
    throw new Error("pickWinner: items must be non-empty");
  }
  if (items.length === 1) {
    return { winner: items[0], index: 0 };
  }

  const buf = new Uint32Array(1);
  const max = Math.floor(0xffffffff / items.length) * items.length;
  let n: number;
  do {
    crypto.getRandomValues(buf);
    n = buf[0];
  } while (n >= max);

  const index = n % items.length;
  return { winner: items[index], index };
}

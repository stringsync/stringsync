type Comparator<T> = (a: T) => -1 | 0 | 1;

/**
 * Returns the value of the first element in the array that satisfies the testing function.
 * Requires that the array is sorted.
 */
export const bsearch = <T>(arr: T[], comparator: Comparator<T>): T | void => {
  if (arr.length === 0) {
    return undefined;
  }

  const mid = Math.floor((arr.length - 1) / 2);
  const probe = arr[mid];
  const left = arr.slice(0, mid);
  const right = arr.slice(mid + 1);

  const cmp = comparator(probe);
  if (cmp === 0) {
    return probe;
  } else if (cmp < 0) {
    return bsearch(left, comparator);
  } else {
    return bsearch(right, comparator);
  }
};

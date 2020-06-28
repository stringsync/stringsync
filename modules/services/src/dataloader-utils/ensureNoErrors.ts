export const ensureNoErrors = <T>(array: Array<Error | T>): Array<T> => {
  for (const el of array) {
    if (el instanceof Error) {
      throw el;
    }
  }
  return array as Array<T>;
};

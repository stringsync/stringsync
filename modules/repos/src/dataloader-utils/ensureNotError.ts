export const ensureNotError = <T>(object: T | Error): T => {
  if (object instanceof Error) {
    throw object;
  }
  return object as T;
};

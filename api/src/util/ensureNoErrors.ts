export const ensureNoErrors = <T extends any>(thing: T): T => {
  const wrapped: any[] = Array.isArray(thing) ? thing : [thing];
  for (const el of wrapped) {
    if (el instanceof Error) {
      throw el;
    }
  }
  return thing as T;
};

export const prev = <T>(element: T, collection: T[]): T | null => {
  const ndx = collection.indexOf(element);
  return ndx === -1 ? null : collection[ndx - 1] || null;
}
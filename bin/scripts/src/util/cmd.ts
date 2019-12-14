export const cmd = (...cmdParts: string[]): string => {
  return cmdParts.filter((str) => str.length > 0).join(' ');
};

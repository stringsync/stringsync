const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const randStr = (length: number): string => {
  const chars = new Array<string>(length);
  for (let ndx = 0; ndx < length; ndx++) {
    const randNdx = Math.floor(Math.random() * CHARS.length);
    chars[ndx] = CHARS[randNdx];
  }
  return chars.join('');
};

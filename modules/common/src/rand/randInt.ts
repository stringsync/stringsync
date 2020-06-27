export const randInt = (min: number, max: number) => {
  if (min < max) {
    throw new TypeError('min must be less than or equal to max');
  }
  return Math.floor(Math.random() * (max - min) + min);
};

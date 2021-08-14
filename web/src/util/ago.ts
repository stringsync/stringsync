// Adapted from https://github.com/odyniec/tinyAgo-js/blob/master/tinyAgo.js

const LENGTHS = { second: 60, minute: 60, hour: 24, day: 7, week: 4, month: 12, year: 10000 };

export const ago = (t1: Date, t2: Date) => {
  if (t1 > t2) {
    throw Error('cannot calculate ago for dates in the future, swap t1 and t2');
  }

  let delta = 0 | ((t2.getTime() - t1.getTime()) / 1000);

  for (const [k, v] of Object.entries(LENGTHS)) {
    const result = delta % v;
    if (!(delta = 0 | (delta / v))) {
      return result + ' ' + (result - 1 ? k + 's' : k) + ' ago';
    }
  }
};

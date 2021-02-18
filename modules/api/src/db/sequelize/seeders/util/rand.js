const { CHARS } = require('./constants');

const randStr = (length) => {
  const chars = new Array(length);
  for (let ndx = 0; ndx < length; ndx++) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    chars[ndx] = sample(CHARS);
  }
  return chars.join('');
};

const randInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

const randId = () => randStr(8);

const sample = (arr) => arr[randInt(0, arr.length)];

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
};

exports.randStr = randStr;
exports.randInt = randInt;
exports.randId = randId;
exports.sample = sample;
exports.shuffle = shuffle;

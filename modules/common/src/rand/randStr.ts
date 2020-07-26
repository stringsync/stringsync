const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const randStr = (length: number): string => {
  const chars = new Array<string>(length);
  for (let ndx = 0; ndx < length; ndx++) {
    const randNdx = Math.floor(Math.random() * CHARS.length);
    chars[ndx] = CHARS[randNdx];
  }
  return chars.join('');
};

const ADJECTIVES = [
  'swift',
  'vulgar',
  'efficacious',
  'foregoing',
  'bewildered',
  'significant',
  'torpid',
  'capable',
  'futuristic',
  'melodic',
  'nebulous',
  'annoying',
  'beneficial',
  'little',
  'unadvised',
  'level',
  'rainy',
  'debonair',
  'educated',
  'thin',
];
const NOUNS = [
  'shy',
  'analysis',
  'enhance',
  'twilight',
  'value',
  'army',
  'cylinder',
  'qualification',
  'peace',
  'depend',
  'buttocks',
  'holiday',
  'motorist',
  'passive',
  'progress',
  'popular',
  'witness',
  'judge',
  'examination',
  'roll',
];
export const randSongName = () => {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adjective} ${noun}`;
};

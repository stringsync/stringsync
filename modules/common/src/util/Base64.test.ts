import { Base64 } from './Base64';

const utf8 = 'Some examples: ❤😀';
const base64 = 'U29tZSBleGFtcGxlczog4p2k8J+YgA==';

describe('encode', () => {
  it('converts from utf-8 to base64', () => {
    expect(Base64.encode(utf8)).toBe(base64);
  });
});

describe('decode', () => {
  it('converts from base64 to utf-8', () => {
    expect(Base64.decode(base64)).toBe(utf8);
  });
});

it('encodes and decodes json', () => {
  const json = JSON.stringify({ foo: 'bar', baz: 'bam', date: new Date() });
  const base64 = Base64.encode(json);
  const utf8 = Base64.decode(base64);
  expect(utf8).toBe(json);
});

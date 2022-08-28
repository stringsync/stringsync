import { overlaps } from './overlaps';

describe('overlaps', () => {
  const proto = { foo: 'foo', bar: 'bar', baz: { value: 42 } };

  it.each([
    { proto, probe: {}, expectation: true },
    { proto, probe: { foo: 'foo' }, expectation: true },
    { proto, probe: { bar: 'bar' }, expectation: true },
    { proto, probe: { bar: 'bar', baz: {} }, expectation: true },
    { proto, probe: { bar: 'bar', baz: { value: 42 } }, expectation: true },
    { proto, probe: { bar: 'bar', baz: { value: 41 } }, expectation: false },
    { proto, probe: { foo: 'bar' }, expectation: false },
    { proto, probe: { bar: 'foo' }, expectation: false },
    { proto, probe: { bar: 'foo' }, expectation: false },
  ])('evaluates whether or not objects overlap', (t) => {
    expect(overlaps(t.proto, t.probe)).toBe(t.expectation);
  });
});

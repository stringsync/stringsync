const add = (a: number, b: number) => a + b;

test('add adds numbers', () => {
  expect(add(1, 1)).toBe(2);
});

test('global', (done) => {
  expect((global as any).db).toBe('foo');
  done();
});

test('global', (done) => {
  expect(async () => await global.db.authenticate()).not.toThrowError();
  done();
});

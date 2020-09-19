expect.extend({
  toFailForSure() {
    return {
      pass: false,
      message: () => 'this will always fail',
    };
  },
});

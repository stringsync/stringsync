declare namespace jest {
  interface Matchers<R> {
    toFailForSure(): R;
  }
}

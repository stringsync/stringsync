// https://github.com/acdlite/recompose/blob/master/src/packages/recompose/compose.js

const compose = (...funcs: Function[]) =>
  funcs.reduce((a, b) => (...args: any[]) => a(b(...args)), (arg: any) => arg);

export default compose;

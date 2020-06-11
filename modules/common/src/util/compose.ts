import { identity } from './identity';
// https://github.com/acdlite/recompose/blob/master/src/packages/recompose/compose.js

export const compose = (...funcs: Function[]) => funcs.reduce((a, b) => (...args: any[]) => a(b(...args)), identity);

// https://medium.com/@martin_hotell/improved-redux-type-safety-with-typescript-2-8-2c11a8062575
export interface IAction<T extends string> {
  type: T;
}

export interface IActionWithPayLoad<T extends string, P> extends IAction<T> {
  payload: P;
}

export function createAction<T extends string>(type: T): IAction<T>;
export function createAction<T extends string, P>(type: T, payload: P): IActionWithPayLoad<T, P>;
export function createAction<T extends string, P>(type: T, payload?: P) {
  return typeof payload === 'undefined' ? { type } : { type, payload };
}

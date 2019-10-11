export * from './User';

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

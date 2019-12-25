export * from './User';
export * from './GetUserInput';
export * from './Notation';
export * from './ReauthPayload';
export * from './SignupInput';
export * from './SignupPayload';
export * from './LoginInput';
export * from './LoginPayload';
export * from './LogoutPayload';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

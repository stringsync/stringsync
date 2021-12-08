import { onUnion, types } from 'typed-graphqlify';
import { DeepPartial, Nullable } from '../util/types';
import * as helpers from './helpers';

type ValueOf<T> = T[keyof T];

type OptionalT = {
  number: Nullable<number>;
  string: Nullable<string>;
  boolean: Nullable<boolean>;
  file: Nullable<File>;
  oneOf: <T extends {}>(_e: T) => Nullable<ValueOf<T>>;
  custom: <T>() => Nullable<T>;
};

type Union<T = string> = {
  __typename?: T;
};

type UnionSelection<U extends Union> = {
  [Typename in NonNullable<U['__typename']>]: DeepPartial<Omit<Extract<U, Union<Typename>>, '__typename'>>;
};

type Selection<S extends UnionSelection<any>, Typename extends keyof S> = S[Typename];

type Flattened<S extends UnionSelection<any>> = {
  [Typename in keyof S]: { __typename: Typename } & Selection<S, Typename>;
}[keyof S];

/**
 * Wrapper around typed-graphqlify's types.
 */
export class t {
  static string = types.string;
  static number = types.number;
  static boolean = types.boolean;
  static oneOf = <T extends {}>(enumerable: T): ValueOf<T> | keyof T => {
    const type = types.oneOf(enumerable);
    // This only works because t is actually a lie:
    // https://github.com/acro5piano/typed-graphqlify/blob/4b9d6d2bd1466dc3e503b1220a20abf8f554133c/src/types.ts#L50
    // If typed-graphqlify changes this, the metadata will have to be attached some other way.
    helpers.injectMeta(type, { isEnum: true });
    return type;
  };
  static custom = types.custom;
  static constant = types.constant;
  static get file(): File {
    const type = types.custom<File>();
    helpers.injectMeta(type, { isFile: true });
    return type;
  }
  static optional: OptionalT = {
    number: t.number,
    string: t.string,
    boolean: t.boolean,
    oneOf: t.oneOf,
    custom: t.custom,
    file: t.file,
  } as any;
  // The reason why we have a returning function is to allow S to be inferred. Otherwise, we get the more genrealized
  // type and we have to specify all parameters.
  static union = <U extends Union>() => <S extends UnionSelection<U>>(types: S): Flattened<S> => {
    const frags = {};
    for (const [__typename, fields] of Object.entries(types)) {
      Object.assign(frags, onUnion({ [__typename]: { __typename: t.constant(__typename), ...(fields as any) } }));
    }
    return frags as any;
  };
}

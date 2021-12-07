import { types } from 'typed-graphqlify';
import { Nullable } from '../util/types';
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
}

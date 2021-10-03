import { types } from 'typed-graphqlify';
import * as helpers from './helpers';

type ValueOf<T> = T[keyof T];

type OptionalT = {
  number?: number;
  string?: string;
  boolean?: boolean;
  oneOf: <T extends {}>(_e: T) => ValueOf<T> | undefined;
  custom: <T>() => T | undefined;
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
  static optional: OptionalT = {
    number: t.number,
    string: t.string,
    boolean: t.boolean,
    oneOf: t.oneOf,
    custom: t.custom,
  } as any;
}
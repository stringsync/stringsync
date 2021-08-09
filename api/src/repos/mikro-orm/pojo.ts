import { wrap } from '@mikro-orm/core';
import { BaseEntity } from '../../db/mikro-orm';

export function pojo<T extends BaseEntity>(value: T): T;
export function pojo<T extends BaseEntity>(value: T[]): T[];
export function pojo<T extends BaseEntity>(value: T | T[]): T | T[] {
  if (Array.isArray(value)) {
    return value.map((v) => wrap(v).toObject(v.associations)) as T[];
  } else {
    return wrap(value).toObject(value.associations) as T;
  }
}

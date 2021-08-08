import { IdentifiedReference, wrap } from '@mikro-orm/core';

const HACK_2099_SYMBOL = Symbol('HACK_2099');

/**
 * Creates a hacked Reference to an entity that is not fully loaded in memory. If the
 * reference's non-PK properties are needed, then the next em.find* call that includes
 * the reference's data needs to be called with the { refresh: true } FindOption. If
 * this isn't done, this reference will not have its data populated.
 *
 * Calling load
 *
 * To avoid this issue, prefer loading a referenced entity into memory, and then
 *
 * See https://github.com/mikro-orm/mikro-orm/issues/2099
 */
export const HACK_2099_createReference = <T>(entity: T): IdentifiedReference<T> => {
  const wrappedEntity = wrap(entity, true);
  wrappedEntity.__initialized = false;
  wrappedEntity.__populated = false;
  const reference = wrappedEntity.toReference();
  Object.defineProperty(reference, HACK_2099_SYMBOL, { value: true });
  return reference;
};

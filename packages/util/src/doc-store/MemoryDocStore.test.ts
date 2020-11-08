import { NotFoundError } from '@stringsync/common';
import { MemoryDocStore } from './MemoryDocStore';

let store: MemoryDocStore;

beforeEach(() => {
  store = new MemoryDocStore();
});

describe('has', () => {
  it('returns true when the key exists', async () => {
    await store.set('foo', 'bar');
    expect(store.has('foo')).resolves.toBeTrue();
  });

  it('returns false when the does not exist', () => {
    expect(store.has('foo')).resolves.toBeFalse();
  });
});

describe('get', () => {
  it('returns the value for set keys', async () => {
    await store.set('foo', 'bar');
    expect(store.get('foo')).resolves.toBe('bar');
  });

  it('returns the value for falsy keys', async () => {
    await store.set('foo', '');
    expect(store.get('foo')).resolves.toBe('');
  });

  it('throws an error if the key is missing', async () => {
    await expect(store.get('foo')).rejects.toThrowError(NotFoundError);
  });
});

describe('set', () => {
  it('sets a key', async () => {
    await store.set('foo', 'bar');
    expect(store.get('foo')).resolves.toBe('bar');
  });

  it('overwrites keys', async () => {
    await store.set('foo', 'bar');
    await store.set('foo', 'baz');
    expect(store.get('foo')).resolves.toBe('baz');
  });
});

describe('delete', () => {
  it('deletes an existing key', async () => {
    await store.set('foo', 'bar');
    await store.delete('foo');
    expect(store.has('foo')).resolves.toBeFalse();
  });

  it('noops when called on a key that does not exist', () => {
    expect(store.delete('foo')).resolves.not.toThrow();
    expect(store.has('foo')).resolves.toBeFalse();
  });
});

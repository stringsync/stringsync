import { NotationPager } from './NotationPager';
import { useTestContainer, TYPES } from '@stringsync/container';

const container = useTestContainer();

let notationPager: NotationPager;

beforeEach(() => {
  notationPager = container.get<NotationPager>(TYPES.NotationPager);
});

describe('encoding', () => {
  it('can encode and decode a cursor', () => {
    const cursor = 1;

    const encodedCursor = notationPager.encodeCursor(cursor);
    const decodedCursor = notationPager.decodeCursor(encodedCursor);

    expect(decodedCursor).toBe(cursor);
  });
});

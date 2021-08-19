import { configureStore } from '@reduxjs/toolkit';
import { sortBy } from 'lodash';
import { $queries } from '../../graphql';
import { buildRandTag } from '../../testing';
import { getTags, tagSlice } from './tagSlice';

describe('tagSlice', () => {
  it('initializes state', () => {
    const store = configureStore({
      reducer: {
        tag: tagSlice.reducer,
      },
    });

    const { tag } = store.getState();
    expect(tag.errors).toStrictEqual([]);
    expect(tag.isPending).toBe(false);
    expect(tag.tags).toStrictEqual([]);
  });

  describe('getTags', () => {
    it('pending', () => {
      const store = configureStore({
        reducer: {
          tag: tagSlice.reducer,
        },
        preloadedState: {
          tag: {
            isPending: false,
            errors: ['error1', 'error2'],
          },
        },
      });

      store.dispatch(getTags.pending('requestId'));

      const { tag } = store.getState();
      expect(tag.isPending).toBe(true);
      expect(tag.errors).toHaveLength(0);
    });

    it('fulfilled', async () => {
      const store = configureStore({
        reducer: {
          tag: tagSlice.reducer,
        },
      });

      const tag1 = buildRandTag();
      const tag2 = buildRandTag();
      const tagsSpy = jest.spyOn($queries, 'tags');
      tagsSpy.mockResolvedValue({
        data: {
          tags: [tag1, tag2],
        },
      });

      await store.dispatch(getTags());

      const { tag } = store.getState();
      expect(tag.isPending).toBe(false);
      expect(tag.errors).toHaveLength(0);
      expect(tag.tags).toStrictEqual(sortBy([tag1, tag2], (tag) => tag.name));
    });
  });
});

import { configureStore } from '@reduxjs/toolkit';
import { TagClient } from '../../graphql';
import { buildRandTag } from '../../testing';
import { getTags, tagSlice } from './tagSlice';

describe('tagSlice', () => {
  let tagClient: TagClient;

  beforeEach(() => {
    tagClient = TagClient.create();
    jest.spyOn(TagClient, 'create').mockReturnValue(tagClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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
      const tagsSpy = jest.spyOn(tagClient, 'tags');
      tagsSpy.mockResolvedValue({
        data: {
          tags: [tag1, tag2],
        },
      });

      await store.dispatch(getTags());

      const { tag } = store.getState();
      expect(tag.isPending).toBe(false);
      expect(tag.errors).toHaveLength(0);
      expect(tag.tags).toStrictEqual([tag1, tag2]);
    });
  });
});

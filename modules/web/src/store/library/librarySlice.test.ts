import { LibraryState, NotationPreview } from './types';
import { librarySlice, addNotations } from './librarySlice';
import { EnhancedStore, configureStore } from '@reduxjs/toolkit';
import { TestFactory } from '@stringsync/common';
import { pick } from 'lodash';

let store: EnhancedStore<{ library: LibraryState }>;

beforeEach(() => {
  store = configureStore({
    reducer: {
      library: librarySlice.reducer,
    },
  });
});

const buildRandNotationPreview = (): NotationPreview => {
  const notation = pick(TestFactory.buildRandNotation(), 'id', 'createdAt', 'updatedAt', 'songName', 'artistName');
  const transcriber = pick(TestFactory.buildRandUser(), 'id', 'username', 'role', 'avatarUrl');
  const json = JSON.stringify({ ...notation, transcriber });
  return JSON.parse(json);
};

it('initializes state', () => {
  expect(store.getState().library.notations).toStrictEqual([]);
});

describe('addNotations', () => {
  it('appends notations to the state', () => {
    const notation1 = buildRandNotationPreview();
    const notation2 = buildRandNotationPreview();
    const notation3 = buildRandNotationPreview();
    const notation4 = buildRandNotationPreview();

    store.dispatch(addNotations({ notations: [notation1, notation2] }));
    expect(store.getState().library.notations).toStrictEqual([notation1, notation2]);

    store.dispatch(addNotations({ notations: [notation3, notation4] }));
    expect(store.getState().library.notations).toStrictEqual([notation1, notation2, notation3, notation4]);
  });
});

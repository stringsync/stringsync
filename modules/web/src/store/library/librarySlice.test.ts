import { configureStore } from '@reduxjs/toolkit';
import { TestFactory, randStr } from '@stringsync/common';
import { NotationClient, NotationEdgeObject, UserRoles } from '../../clients';
import { getNotationPage, librarySlice } from './librarySlice';

const buildRandNotationEdge = (): NotationEdgeObject => {
  const transcriber = TestFactory.buildRandUser();
  const notation = TestFactory.buildRandNotation({ transcriberId: transcriber.id });
  return {
    node: { ...notation, transcriber: { ...transcriber, role: UserRoles.TEACHER }, tags: [] },
    cursor: randStr(8),
  };
};

let notationClient: NotationClient;

beforeEach(() => {
  notationClient = NotationClient.create();
  jest.spyOn(NotationClient, 'create').mockReturnValue(notationClient);
});

afterEach(() => {
  jest.clearAllMocks();
});

it('initializes state', () => {
  const store = configureStore({
    reducer: {
      library: librarySlice.reducer,
    },
  });

  expect(store.getState().library.notations).toStrictEqual([]);
});

describe('getNotationPage', () => {
  it('pending', () => {
    const store = configureStore({
      reducer: {
        library: librarySlice.reducer,
      },
      preloadedState: {
        library: {
          isPending: false,
          errors: ['error1', 'error2'],
        },
      },
    });

    store.dispatch(getNotationPage.pending('requestId', {}));

    const state = store.getState();
    expect(state.library.isPending).toBe(true);
    expect(state.library.errors).toHaveLength(0);
  });

  it('fulfilled', async () => {
    const store = configureStore({
      reducer: {
        library: librarySlice.reducer,
      },
    });

    const edge1 = buildRandNotationEdge();
    const edge2 = buildRandNotationEdge();
    const notationsSpy = jest.spyOn(notationClient, 'notations');
    notationsSpy.mockResolvedValue({
      data: {
        notations: {
          edges: [edge1, edge2],
          pageInfo: { startCursor: edge1.cursor, endCursor: edge2.cursor, hasNextPage: false, hasPreviousPage: false },
        },
      },
    });

    const state = store.getState();
    const { notations, isPending, pageInfo } = state.library;
    expect(notations).toStrictEqual([edge1.node, edge2.node]);
    expect(isPending).toBe(false);
    expect(pageInfo.startCursor).toBe(edge1.cursor);
    expect(pageInfo.endCursor).toBe(edge2.cursor);
    expect(pageInfo.hasNextPage).toBe(false);
    expect(pageInfo.hasPreviousPage).toBe(false);
  });
});

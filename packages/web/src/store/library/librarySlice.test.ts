import { configureStore } from '@reduxjs/toolkit';
import { randStr } from '@stringsync/common';
import { EntityBuilder, UserRole } from '@stringsync/domain';
import { NotationClient, NotationEdgeObject, UserRoles } from '../../clients';
import { clearErrors, clearPages, getNotationPage, librarySlice } from './librarySlice';

const buildRandNotationEdge = (): NotationEdgeObject => {
  const transcriber = EntityBuilder.buildRandUser();
  const notation = EntityBuilder.buildRandNotation({ transcriberId: transcriber.id });
  return JSON.parse(
    JSON.stringify({
      node: { ...notation, transcriber: { ...transcriber, role: UserRoles.TEACHER }, tags: [] },
      cursor: randStr(8),
    })
  );
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

it('clears errors', () => {
  const store = configureStore({
    reducer: {
      library: librarySlice.reducer,
    },
    preloadedState: {
      library: {
        errors: ['error1', 'error2'],
      },
    },
  });

  store.dispatch(clearErrors());

  const state = store.getState();
  expect(state.library.errors).toHaveLength(0);
});

it('clears pages', () => {
  const nowStr = new Date().toString();
  const store = configureStore({
    reducer: {
      library: librarySlice.reducer,
    },
    preloadedState: {
      library: {
        notations: [
          {
            id: randStr(8),
            artistName: randStr(10),
            createdAt: nowStr,
            updatedAt: nowStr,
            songName: randStr(10),
            thumbnailUrl: randStr(10),
            tags: [],
            transcriber: {
              id: randStr(8),
              avatarUrl: randStr(10),
              role: UserRole.TEACHER,
              username: randStr(8),
            },
          },
        ],
        errors: ['error1', 'error2'],
        pageInfo: {
          startCursor: randStr(16),
          endCursor: randStr(16),
          hasNextPage: true,
          hasPreviousPage: false,
        },
      },
    },
  });

  store.dispatch(clearPages());

  const state = store.getState();
  expect(state.library.notations).toHaveLength(0);
  expect(state.library.errors).toHaveLength(0);
  expect(state.library.pageInfo).toStrictEqual({
    startCursor: null,
    endCursor: null,
    hasNextPage: true,
    hasPreviousPage: false,
  });
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

    store.dispatch(getNotationPage.pending('requestId', { pageSize: 9 }));

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

    await store.dispatch(getNotationPage({ pageSize: 9 }));

    const state = store.getState();
    const { notations, isPending, pageInfo } = state.library;
    expect(notations).toStrictEqual([edge2.node, edge1.node]);
    expect(isPending).toBe(false);
    expect(pageInfo.startCursor).toBe(edge1.cursor);
    expect(pageInfo.endCursor).toBe(edge2.cursor);
    expect(pageInfo.hasNextPage).toBe(false);
    expect(pageInfo.hasPreviousPage).toBe(false);
  });
});

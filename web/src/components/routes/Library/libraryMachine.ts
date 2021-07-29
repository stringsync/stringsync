import { cloneDeep } from 'lodash';
import { assign, Condition, ContextFrom, DoneInvokeEvent, EventFrom, InvokeCreator } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { $queries, NotationEdgeObject, toUserRole } from '../../../graphql';
import { NotationPreview } from './types';

type NotationPage = {
  notations: NotationPreview[];
  startCursor: string | null;
  hasNextPage: boolean;
};

const PAGE_SIZE = 9;

export const libraryModel = createModel(
  {
    queryArgs: {
      last: PAGE_SIZE,
      before: null as string | null,
      query: null as string | null,
      tagIds: null as string[] | null,
    },
    notations: new Array<NotationPreview>(),
    error: null as string | null,
    hasLoadedFirstPage: false,
  },
  {
    events: {
      loadPage: () => ({}),
      setQueryArgs: (query: string, tagIds: string[]) => ({ query, tagIds }),
      retryLoadPage: () => ({}),
    },
  }
);

export type LibraryContext = ContextFrom<typeof libraryModel>;

export type LibraryEvent = EventFrom<typeof libraryModel>;

const setQueryArgs = assign<LibraryContext, { type: 'setQueryArgs'; query: string; tagIds: string[] }>(
  (context, event) => {
    const nextContext = cloneDeep(libraryModel.initialContext);
    nextContext.queryArgs.query = event.query || null;
    nextContext.queryArgs.tagIds = event.tagIds.length ? event.tagIds : null;
    return nextContext;
  }
);

const clearError = assign<LibraryContext, { type: 'loadPage' }>((context, event) => ({
  error: null,
}));

const applyNotationPage = assign<LibraryContext, DoneInvokeEvent<NotationPage>>((context, event) => ({
  notations: [...context.notations, ...event.data.notations],
  queryArgs: {
    ...context.queryArgs,
    before: event.data.startCursor,
  },
  hasLoadedFirstPage: true,
}));

const applyErrors = assign<LibraryContext, DoneInvokeEvent<string>>((context, event) => ({
  error: event.data,
}));

const toNotationPreview = (edge: NotationEdgeObject): NotationPreview => {
  const role = toUserRole(edge.node.transcriber.role);
  const transcriber = { ...edge.node.transcriber, role };
  return { ...edge.node, transcriber } as NotationPreview;
};

const fetchNotationPage: InvokeCreator<LibraryContext, LibraryEvent> = async (context): Promise<NotationPage> => {
  const queryArgs = context.queryArgs;
  queryArgs.query = queryArgs.query || null;
  const { data, errors } = await $queries.notations(context.queryArgs);
  if (errors) {
    // TODO(jared) show specific errors
    throw new Error('something went wrong');
  }
  const connection = data.notations;
  // the server sorts by ascending cursor, but we're pagingating backwards
  // this is correct according to spec:
  // https://relay.dev/graphql/connections.htm#sec-Backward-pagination-arguments
  const notations = connection.edges.map(toNotationPreview).reverse();
  const startCursor = connection.pageInfo.startCursor || null;
  const hasNextPage = connection.pageInfo.hasNextPage;

  return { notations, startCursor, hasNextPage };
};

const hasNextPage: Condition<LibraryContext, DoneInvokeEvent<NotationPage>> = (context, event) =>
  event.data.hasNextPage;

export const libraryMachine = libraryModel.createMachine({
  initial: 'idle',
  strict: true,
  states: {
    idle: {
      on: {
        loadPage: { target: 'streaming' },
        setQueryArgs: { actions: [setQueryArgs] },
      },
    },
    streaming: {
      on: {
        setQueryArgs: {
          target: 'idle',
          actions: [setQueryArgs],
        },
      },
      initial: 'loading',
      states: {
        loading: {
          invoke: {
            src: fetchNotationPage,
            onDone: [
              { target: 'success', cond: hasNextPage, actions: [applyNotationPage] },
              { target: 'success', actions: [applyNotationPage] },
            ],
            onError: { target: 'failure', actions: [applyErrors] },
          },
        },
        success: {
          on: { loadPage: { target: 'loading' } },
        },
        failure: {
          on: { loadPage: { target: 'loading', actions: [clearError] } },
        },
      },
    },
    done: { type: 'final' },
  },
});

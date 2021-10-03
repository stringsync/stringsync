import { cloneDeep } from 'lodash';
import { assign, Condition, ContextFrom, DoneInvokeEvent, EventFrom, InvokeCreator } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { UnknownError } from '../../errors';
import { DataOf, toUserRole } from '../../graphql';
import { NOTATIONS_GQL } from './queries';
import { NotationPreview } from './types';

type NotationPage = {
  notations: NotationPreview[];
  startCursor: string | null;
  hasNextPage: boolean;
};

export type LibraryContext = ContextFrom<typeof libraryModel>;

export type LibraryEvent = EventFrom<typeof libraryModel>;

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
    errors: new Array<Error>(),
    hasLoadedFirstPage: false,
  },
  {
    events: {
      loadPage: () => ({}),
      retryLoadPage: () => ({}),
      setQueryArgs: (query: string, tagIds: string[]) => ({ query, tagIds }),
      clear: () => ({}),
    },
  }
);

const setQueryArgs = assign<LibraryContext, { type: 'setQueryArgs'; query: string; tagIds: string[] }>(
  (context, event) => {
    const nextContext = cloneDeep(libraryModel.initialContext);
    nextContext.queryArgs.query = event.query || null;
    nextContext.queryArgs.tagIds = event.tagIds.length ? event.tagIds : null;
    return nextContext;
  }
);

const clearErrors = assign<LibraryContext, { type: 'retryLoadPage' }>((context, event) => ({
  errors: [],
}));

const applyNotationPage = assign<LibraryContext, DoneInvokeEvent<NotationPage>>((context, event) => ({
  notations: [...context.notations, ...event.data.notations],
  queryArgs: {
    ...context.queryArgs,
    before: event.data.startCursor,
  },
  hasLoadedFirstPage: true,
}));

const applyErrors = assign<LibraryContext, DoneInvokeEvent<Error[]>>((context, event) => ({
  errors: event.data,
}));

const clear = assign<LibraryContext, { type: 'clear' }>((context, event) => {
  return cloneDeep(libraryModel.initialContext);
});

const toNotationPreviews = (connection: DataOf<typeof NOTATIONS_GQL>): NotationPreview[] => {
  return (connection?.edges || []).map((edge) => {
    const role = toUserRole(edge.node.transcriber.role);
    const transcriber = { ...edge.node.transcriber, role };
    return { ...edge.node, transcriber } as NotationPreview;
  });
};

const fetchNotationPage: InvokeCreator<LibraryContext, LibraryEvent> = async (context): Promise<NotationPage> => {
  const { data, errors } = await NOTATIONS_GQL.fetch(context.queryArgs);
  if (errors) {
    throw errors;
  }
  if (!data) {
    throw new UnknownError();
  }
  const connection = data.notations;
  if (!connection) {
    throw new UnknownError();
  }
  // the server sorts by ascending cursor, but we're pagingating backwards
  // this is correct according to spec:
  // https://relay.dev/graphql/connections.htm#sec-Backward-pagination-arguments
  const notations = toNotationPreviews(connection).reverse();
  const startCursor = connection.pageInfo.startCursor || null;
  const hasNextPage = connection.pageInfo.hasNextPage;

  return { notations, startCursor, hasNextPage };
};

const hasNextPage: Condition<LibraryContext, DoneInvokeEvent<NotationPage>> = (context, event) => {
  return event.data.hasNextPage;
};

export const libraryMachine = libraryModel.createMachine({
  id: 'library',
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
        clear: { target: 'idle', actions: [clear] },
      },
      initial: 'loading',
      states: {
        loading: {
          invoke: {
            src: fetchNotationPage,
            onDone: [
              { target: 'success', cond: hasNextPage, actions: [applyNotationPage] },
              { target: '#library.done', actions: [applyNotationPage] },
            ],
            onError: { target: 'failure', actions: [applyErrors] },
          },
        },
        success: {
          on: { loadPage: { target: 'loading' } },
        },
        failure: {
          on: { retryLoadPage: { target: 'loading', actions: [clearErrors] } },
        },
      },
    },
    done: {
      on: { clear: { target: 'idle', actions: [clear] } },
    },
  },
});

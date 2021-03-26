import { useCallback, useState } from 'react';
import { $queries, NotationEdgeObject, QueryNotationsArgs, toUserRole } from '../../../graphql';
import { getInitialPageInfo } from '../../../util/pager';
import { LibraryState, LibraryStatus, NotationPreview } from './types';

const toNotationPreview = (edge: NotationEdgeObject): NotationPreview => {
  const role = toUserRole(edge.node.transcriber.role);
  const transcriber = { ...edge.node.transcriber, role };
  return { ...edge.node, transcriber } as NotationPreview;
};

export const useLibraryState = (): LibraryState => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState(LibraryStatus.READY);
  const [notations, setNotations] = useState(new Array<NotationPreview>());
  const [pageInfo, setPageInfo] = useState(getInitialPageInfo());
  const [errors, setErrors] = useState(new Array<Error>());

  const ready = useCallback(() => {
    setStatus(LibraryStatus.READY);
  }, []);

  const loading = () => {
    setStatus(LibraryStatus.LOADING);
  };

  const loaded = () => {
    setStatus(LibraryStatus.LOADED);
  };

  const resetLibrary = () => {
    setNotations([]);
    setErrors([]);
    setPageInfo(getInitialPageInfo());
    setIsInitialized(false);
    ready();
  };

  const clearErrors = () => {
    setErrors([]);
    ready();
  };

  const loadMoreNotations = useCallback(async (args: QueryNotationsArgs) => {
    setErrors([]);
    loading();

    try {
      const { data, errors } = await $queries.notations(args);
      if (errors) {
        throw errors;
      }
      const connection = data.notations;
      // the server sorts by ascending cursor, but we're pagingating backwards
      // this is correct according to spec:
      // https://relay.dev/graphql/connections.htm#sec-Backward-pagination-arguments
      const nextNotations = connection.edges.map(toNotationPreview).reverse();
      setNotations((prevNotations) => prevNotations.concat(nextNotations));
      setPageInfo({
        startCursor: connection.pageInfo.startCursor || null,
        endCursor: connection.pageInfo.endCursor || null,
        hasNextPage: connection.pageInfo.hasNextPage,
        hasPreviousPage: connection.pageInfo.hasPreviousPage,
      });
    } catch (e) {
      setErrors(Array.isArray(e) ? e : [e]);
    } finally {
      loaded();
      setIsInitialized(true);
    }
  }, []);

  return {
    status,
    notations,
    pageInfo,
    errors,
    isInitialized,
    loadMoreNotations,
    clearErrors,
    resetLibrary,
    ready,
  };
};

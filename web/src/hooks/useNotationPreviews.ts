import { useCallback, useEffect, useState } from 'react';
import * as graphql from '../lib/graphql';
import * as library from '../lib/library';
import * as pager from '../lib/pager';
import * as queries from '../lib/queries';
import { GqlReqStatus, useGql2 } from './useGql2';

type LoadPage = () => void;

const toNotationPreviews = (
  connection: graphql.DataOf<typeof queries.NOTATION_PREVIEWS>
): library.NotationPreview[] => {
  return (connection?.edges || []).map((edge) => {
    const transcriber = { ...edge.node.transcriber };
    return { ...edge.node, transcriber } as library.NotationPreview;
  });
};

export const useNotationPreviews = (
  pageSize: number
): [notations: library.NotationPreview[], pageInfo: pager.PageInfo, loadPage: LoadPage] => {
  const [notations, setNotations] = useState(new Array<library.NotationPreview>());
  const [pageInfo, setPageInfo] = useState(pager.getInitialPageInfo);

  const [exec, res, cancel] = useGql2(queries.NOTATION_PREVIEWS);

  const loadPage = useCallback(() => {
    if (res.status === GqlReqStatus.Pending) {
      return;
    }
    if (!pageInfo.hasNextPage) {
      return;
    }
    exec({ first: pageSize, after: pageInfo.endCursor });
  }, [exec, res, pageSize, pageInfo]);

  useEffect(() => {
    switch (res.status) {
      case GqlReqStatus.Success:
        const connection = res.data.notations!;
        setNotations((notations) => [...notations, ...toNotationPreviews(connection)]);
        setPageInfo(connection.pageInfo);
    }
  }, [res]);

  return [notations, pageInfo, loadPage];
};

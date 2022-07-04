import { useCallback } from 'react';
import * as graphql from '../lib/graphql';
import * as xhr from '../lib/xhr';
import { useReq } from './useReq';

const GRAPHQL_URI = `${window.location.origin}/graphql`;

export type Exec<G extends graphql.Any$gql> = (variables: graphql.VariablesOf<G>) => void;

export const useGql2 = <G extends graphql.Any$gql>(
  gql: G
): [exec: Exec<G>, res: xhr.Res<graphql.GqlResponseOf<G>>, cancel: xhr.Cancel] => {
  const [req, res, cancel] = useReq(graphql.$gql.toGqlResponse);

  const exec = useCallback(
    (variables: graphql.VariablesOf<G>) => {
      req(GRAPHQL_URI, gql.toRequestInit(variables));
    },
    [req, gql]
  );

  return [exec, res, cancel];
};

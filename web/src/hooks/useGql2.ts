import { useCallback, useState } from 'react';
import { MissingDataError } from '../lib/errors';
import * as graphql from '../lib/graphql';
import * as xhr from '../lib/xhr';
import { useReq } from './useReq';
import { useResHandler } from './useResHandlers';

const GRAPHQL_URI = `${window.location.origin}/graphql`;

export type Exec<G extends graphql.Any$gql> = (variables: graphql.VariablesOf<G>) => void;

// The reason why we use this instead of $gql.GqlResponseOf, is because the server can return data and populate errors.
// Callers can use the status discriminant to determine what the response looks like instead of testing the presence
// of the data and errors properties.
export enum GqlReqStatus {
  Init,
  Pending,
  Success,
  Error,
  Cancelled,
}

export type GqlRes<G extends graphql.Any$gql> =
  | {
      status: GqlReqStatus.Init;
    }
  | {
      status: GqlReqStatus.Pending;
    }
  | {
      status: GqlReqStatus.Success;
      data: graphql.SuccessfulResponse<G>['data'];
    }
  | {
      status: GqlReqStatus.Error;
      errors: string[];
    }
  | {
      status: GqlReqStatus.Cancelled;
    };

export const useGql2 = <G extends graphql.Any$gql>(
  gql: G
): [exec: Exec<G>, res: GqlRes<G>, cancel: xhr.Cancel, reset: xhr.Reset] => {
  const [req, res, cancel, reset] = useReq(graphql.$gql.toGqlResponse);

  const exec = useCallback(
    (variables: graphql.VariablesOf<G>) => {
      req(GRAPHQL_URI, gql.toRequestInit(variables));
    },
    [req, gql]
  );

  const [gqlRes, setGqlRes] = useState<GqlRes<G>>({ status: GqlReqStatus.Init });
  useResHandler(xhr.Status.Init, res, (res) => {
    setGqlRes({ status: GqlReqStatus.Init });
  });
  useResHandler(xhr.Status.Pending, res, (res) => {
    setGqlRes({ status: GqlReqStatus.Pending });
  });
  useResHandler(xhr.Status.Success, res, (res) => {
    const { data, errors } = res.result;
    if (errors) {
      setGqlRes({ status: GqlReqStatus.Error, errors: errors.map((error) => error.message) });
    } else if (!data) {
      setGqlRes({ status: GqlReqStatus.Error, errors: [new MissingDataError().message] });
    } else {
      setGqlRes({ status: GqlReqStatus.Success, data });
    }
  });
  useResHandler(xhr.Status.Error, res, (res) => {
    setGqlRes({ status: GqlReqStatus.Error, errors: [res.error.message] });
  });
  useResHandler(xhr.Status.Cancelled, res, (res) => {
    setGqlRes({ status: GqlReqStatus.Cancelled });
  });

  return [exec, gqlRes, cancel, reset];
};
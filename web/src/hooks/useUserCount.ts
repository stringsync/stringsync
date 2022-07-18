import { useState } from 'react';
import { UNKNOWN_ERROR_MSG } from '../lib/errors';
import { $gql, t, UserCountOutput } from '../lib/graphql';
import { notify } from '../lib/notify';
import { useEffectOnce } from './useEffectOnce';
import { useGql } from './useGql';
import { useGqlResHandler } from './useGqlResHandler';

const USER_COUNT_GQL = $gql
  .query('userCount')
  .setQuery({
    ...t.union<UserCountOutput>()({
      NumberValue: {
        __typename: t.constant('NumberValue'),
        value: t.number,
      },
      ForbiddenError: {
        __typename: t.constant('ForbiddenError'),
        message: t.string,
      },
      UnknownError: {
        __typename: t.constant('UnknownError'),
        message: t.string,
      },
    }),
  })
  .build();

export const useUserCount = (): number | null => {
  const [userCount, setUserCount] = useState<number | null>(null);

  const [execute, res] = useGql(USER_COUNT_GQL);
  useGqlResHandler.onSuccess(res, ({ data }) => {
    switch (data.userCount?.__typename) {
      case 'NumberValue':
        setUserCount(data.userCount.value);
        break;
      default:
        notify.modal.error({
          title: 'error',
          content: data.userCount?.message || UNKNOWN_ERROR_MSG,
        });
    }
  });

  useEffectOnce(() => {
    execute();
  });

  return userCount;
};

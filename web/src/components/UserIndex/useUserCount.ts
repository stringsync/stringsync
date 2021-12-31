import { useState } from 'react';
import { UNKNOWN_ERROR_MSG } from '../../errors';
import { $gql, t, UserCountOutput } from '../../graphql';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { useGql } from '../../hooks/useGql';
import { notify } from '../../lib/notify';

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

  const { execute } = useGql(USER_COUNT_GQL, {
    onData: (data) => {
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
    },
  });

  useEffectOnce(() => {
    execute();
  });

  return userCount;
};

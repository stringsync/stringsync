import { Modal } from 'antd';
import { useState } from 'react';
import { UNKNOWN_ERROR_MSG } from '../../errors';
import { $gql, t, UserCountOutput } from '../../graphql';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { useGql } from '../../hooks/useGql';

const USER_COUNT_GQL = $gql
  .query('userCount')
  .setQuery({
    ...t.union<UserCountOutput>()({
      NumberValue: {
        value: t.number,
      },
      ForbiddenError: {
        message: t.string,
      },
      UnknownError: {
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
          Modal.error({
            title: 'error',
            content: data.userCount?.message || UNKNOWN_ERROR_MSG,
            maskClosable: true,
          });
      }
    },
  });

  useEffectOnce(() => {
    execute();
  });

  return userCount;
};

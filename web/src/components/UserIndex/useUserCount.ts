import { useState } from 'react';
import { $gql, t } from '../../graphql';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { useGql } from '../../hooks/useGql';

const USER_COUNT_GQL = $gql
  .query('userCount')
  .setQuery(t.number)
  .build();

export const useUserCount = (): number | null => {
  const [userCount, setUserCount] = useState<number | null>(null);

  const { execute } = useGql(USER_COUNT_GQL, {
    onData: (data) => {
      setUserCount(data.userCount);
    },
  });

  useEffectOnce(() => {
    execute();
  });

  return userCount;
};

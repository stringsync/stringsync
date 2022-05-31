import { useCallback, useState } from 'react';
import { $gql, QueryUsersArgs, t, User, UserRole } from '../lib/graphql';
import { useGql } from './useGql';
import { Nullable } from '../util/types';

type LoadUsers = (limit: number) => void;

type UserPreview = Pick<User, 'id' | 'username' | 'email' | 'role' | 'avatarUrl' | 'confirmedAt' | 'createdAt'>;

const USERS_GQL = $gql
  .query('users')
  .setQuery({
    edges: [
      {
        cursor: t.string,
        node: {
          id: t.string,
          username: t.string,
          email: t.string,
          role: t.optional.oneOf(UserRole)!,
          avatarUrl: t.optional.string,
          confirmedAt: t.string,
          createdAt: t.string,
        },
      },
    ],
    pageInfo: {
      startCursor: t.optional.string,
      hasNextPage: t.boolean,
    },
  })
  .setVariables<Pick<QueryUsersArgs, 'before' | 'last'>>({
    before: t.optional.string,
    last: t.number,
  })
  .build();

export const useUsers = (): [users: UserPreview[], loading: boolean, hasNextPage: boolean, errors: string[], loadUsers: LoadUsers] => {
  const [users, setUsers] = useState(new Array<UserPreview>());
  const [cursor, setCursor] = useState<Nullable<string>>(null);
  const [errors, setErrors] = useState(new Array<string>());
  const [hasNextPage, setHasNextPage] = useState(true);

  const { execute, loading } = useGql(USERS_GQL, {
    onData: (data) => {
      if (!data.users) {
        setErrors(['missing user data']);
        return;
      }
      const nextUsers = data.users.edges.map((edge) => edge.node);
      setUsers((currentUsers) => [...currentUsers, ...nextUsers]);
      setCursor(data.users.pageInfo.startCursor || null);
      setHasNextPage(data.users.pageInfo.hasNextPage);
    },
    onErrors: (errors) => {
      setErrors(errors);
    },
  });

  const loadUsers = useCallback(
    (limit: number) => {
      if (hasNextPage) {
        execute({ before: cursor, last: limit });
      }
    },
    [execute, cursor, hasNextPage]
  );

  return [users, loading, hasNextPage, errors, loadUsers];
};

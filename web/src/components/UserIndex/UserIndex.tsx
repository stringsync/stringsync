import { Alert, Avatar, Button, Divider, List, Row, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Layout, withLayout } from '../../hocs/withLayout';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { useNow } from '../../hooks/useNow';
import { ago } from '../../util/ago';
import { compose } from '../../util/compose';
import { Box } from '../Box';
import { UserForm } from './UserForm';
import { useUserCount } from './useUserCount';
import { useUsers } from './useUsers';

const PAGE_SIZE = 25;

const Outer = styled.div`
  margin-top: 24px;
`;

const LoadMoreRow = styled(Row)`
  margin-top: 24px;
`;

const enhance = compose(withLayout(Layout.DEFAULT));

export const UserIndex: React.FC = enhance(() => {
  const [users, loading, hasNextPage, errors, loadUsers] = useUsers();

  const userCount = useUserCount();

  const onClick = () => {
    loadUsers(PAGE_SIZE);
  };

  useEffectOnce(() => {
    loadUsers(PAGE_SIZE);
  });

  const now = useNow();

  return (
    <Outer data-testid="user-index">
      <Typography.Title level={2}>{userCount || '???'} users</Typography.Title>

      {errors.length > 0 && (
        <>
          <Alert
            message="Error"
            type="error"
            closable
            description={
              <ul>
                {errors.map((error, ndx) => (
                  <li key={`user-error-${ndx}`}>{error}</li>
                ))}
              </ul>
            }
          />

          <br />
        </>
      )}

      <Box>
        <List
          dataSource={users}
          loadMore={
            <LoadMoreRow justify="center">
              {hasNextPage ? (
                <Button disabled={loading} loading={loading} onClick={onClick}>
                  load more
                </Button>
              ) : (
                <div>no more users</div>
              )}
            </LoadMoreRow>
          }
          renderItem={(user, ndx) => (
            <List.Item key={user.id}>
              <List.Item.Meta
                avatar={<Avatar src={user.avatarUrl} />}
                title={
                  <div>
                    {ndx + 1}. {user.username}
                    <Divider type="vertical" />
                    created {ago(new Date(user.createdAt), now) || '???'}
                  </div>
                }
                description={
                  <div>
                    <a href={`mailto:${user.email}`} target="_blank" rel="noreferrer">
                      {user.email}
                    </a>
                    <Divider type="vertical" />
                    {user.confirmedAt ? `confirmed ${ago(new Date(user.confirmedAt), now)}` || '???' : 'not confirmed'}
                  </div>
                }
              />

              <UserForm user={user} />
            </List.Item>
          )}
        />
      </Box>
    </Outer>
  );
});

export default UserIndex;

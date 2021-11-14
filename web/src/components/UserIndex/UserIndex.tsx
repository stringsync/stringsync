import { Alert, Avatar, Button, List, Row, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Layout, withLayout } from '../../hocs/withLayout';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { compose } from '../../util/compose';
import { Box } from '../Box';
import { UserForm } from './UserForm';
import { useUserCount } from './useUserCount';
import { useUsers } from './useUsers';

const PAGE_SIZE = 50;

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
          renderItem={(user) => (
            <List.Item key={user.id}>
              <List.Item.Meta avatar={<Avatar src={user.avatarUrl} />} title={user.username} description={user.email} />

              <UserForm user={user} />
            </List.Item>
          )}
        />
      </Box>
    </Outer>
  );
});

export default UserIndex;

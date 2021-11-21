import { Alert, List, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { TagCategory } from '../../graphql';
import { Layout, withLayout } from '../../hocs/withLayout';
import { useTags } from '../../hooks/useTags';
import { compose } from '../../util/compose';
import { Box } from '../Box';
import { TagForm } from './TagForm';

const Outer = styled.div`
  margin-top: 24px;
`;

const NULL_TAGS = [{ id: '', name: '', category: TagCategory.GENRE }];

const enhance = compose(withLayout(Layout.DEFAULT));

export const TagIndex = enhance(() => {
  const [tags, errors, loading] = useTags();

  return (
    <Outer data-testid="tag-index">
      <Typography.Title level={2}>tags</Typography.Title>

      {errors.length > 0 && (
        <>
          <Alert
            message="Error"
            type="error"
            closable
            description={
              <ul>
                {errors.map((error, ndx) => (
                  <li key={`tag-error-${ndx}`}>{error}</li>
                ))}
              </ul>
            }
          />

          <br />
        </>
      )}

      <Box>
        <List
          dataSource={tags}
          renderItem={(tag) => (
            <List.Item key={tag.id}>
              <TagForm tag={tag} />
            </List.Item>
          )}
        />
      </Box>

      <br />
      <br />

      <Box>
        <List
          dataSource={NULL_TAGS}
          renderItem={(tag) => (
            <List.Item key={tag.id}>
              <TagForm tag={tag} />
            </List.Item>
          )}
        />
      </Box>
    </Outer>
  );
});

export default TagIndex;

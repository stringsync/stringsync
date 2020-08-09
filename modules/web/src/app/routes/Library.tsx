import React, { useCallback } from 'react';
import { compose, PageInfo } from '@stringsync/common';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, withLayout } from '../../hocs';
import { AppDispatch, RootState } from '../../store';
import { getNotationPage } from '../../store/library';
import { NotationPreview } from '../../store/library/types';
import { NotationList } from '../../components/NotationList';
import styled from 'styled-components';
import { Input, Row, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const PAGE_SIZE = 9;

const Outer = styled.div<{ xs: boolean }>`
  margin: 48px ${(props) => (props.xs ? 0 : 24)}px;
`;

const SearchIcon = styled(SearchOutlined)`
  color: rgba(0, 0, 0, 0.25);
`;

const TagSearchRow = styled(Row)`
  margin-top: 8px;
`;

const enhance = compose(withLayout(Layout.DEFAULT));

interface Props {}

const Library: React.FC<Props> = enhance(() => {
  const dispatch = useDispatch<AppDispatch>();
  const notations = useSelector<RootState, NotationPreview[]>((state) => state.library.notations);
  const pageInfo = useSelector<RootState, PageInfo>((state) => state.library.pageInfo);
  const xs = useSelector<RootState, boolean>((state) => state.viewport.xs);
  const hasNextPage = useSelector<RootState, boolean>(
    (state) => !state.library.isPending && Boolean(state.library.pageInfo.hasNextPage)
  );
  const tags = [
    { id: 'asdf', name: 'acoustic' },
    { id: 'asdf23', name: 'ambient' },
  ];

  const loadNextNotationPage = useCallback(() => {
    dispatch(getNotationPage({ first: PAGE_SIZE, after: pageInfo.endCursor }));
  }, [dispatch, pageInfo.endCursor]);

  return (
    <Outer data-testid="library" xs={xs}>
      <Input placeholder="song, artist, or transcriber name" prefix={<SearchIcon />} />
      <TagSearchRow justify="center" align="middle">
        {tags.map((tag) => (
          <Tag.CheckableTag checked={false}>{tag.name}</Tag.CheckableTag>
        ))}
      </TagSearchRow>
      <br />
      <br />
      <NotationList
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
        notations={notations}
        hasNextPage={hasNextPage}
        loadMore={loadNextNotationPage}
      />
    </Outer>
  );
});

export default Library;

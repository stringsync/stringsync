import React, { useCallback, useState } from 'react';
import { compose, PageInfo } from '@stringsync/common';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, withLayout } from '../../hocs';
import { AppDispatch, RootState } from '../../store';
import { getNotationPage } from '../../store/library';
import { NotationPreview } from '../../store/library/types';
import { NotationList } from '../../components/NotationList';
import styled from 'styled-components';
import { Input, Row, Tag as AntdTag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Tag } from '@stringsync/domain';
import { TagClient } from '../../clients';
import { useEffectOnce } from '../../hooks';

const PAGE_SIZE = 9;

const Outer = styled.div<{ xs: boolean }>`
  margin: 48px ${(props) => (props.xs ? 0 : 24)}px;
`;

const SearchIcon = styled(SearchOutlined)`
  color: rgba(0, 0, 0, 0.25);
`;

const TagSearch = styled(Row)`
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
  const [tags, setTags] = useState(new Array<Tag>());

  useEffectOnce(() => {
    const tagClient = TagClient.create();
    // https://github.com/facebook/react/issues/14326#issuecomment-441680293
    const call = async () => {
      const tagsRes = await tagClient.tags();
      setTags(tagsRes.data.tags);
    };
    call();
  });

  const loadNextNotationPage = useCallback(() => {
    dispatch(getNotationPage({ first: PAGE_SIZE, after: pageInfo.endCursor }));
  }, [dispatch, pageInfo.endCursor]);

  return (
    <Outer data-testid="library" xs={xs}>
      <Input placeholder="song, artist, or transcriber name" prefix={<SearchIcon />} />
      <TagSearch justify="center" align="middle">
        {tags.map((tag) => (
          <AntdTag.CheckableTag checked={false}>{tag.name}</AntdTag.CheckableTag>
        ))}
      </TagSearch>
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

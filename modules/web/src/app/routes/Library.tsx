import React, { useCallback, useState, ChangeEvent } from 'react';
import { compose, PageInfo } from '@stringsync/common';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, withLayout } from '../../hocs';
import { AppDispatch, RootState, getTags } from '../../store';
import { getNotationPage, clearErrors } from '../../store/library';
import { NotationPreview } from '../../store/library/types';
import { NotationList } from '../../components/NotationList';
import styled from 'styled-components';
import { Input, Row, Tag as AntdTag, Button, Affix, Alert } from 'antd';
import { Tag } from '@stringsync/domain';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useEffectOnce } from '../../hooks';
import { mapValues } from 'lodash';

const { CheckableTag } = AntdTag;

const PAGE_SIZE = 9;

const Outer = styled.div<{ xs: boolean }>`
  margin: 24px ${(props) => (props.xs ? 0 : 24)}px;
`;

const Search = styled.div<{ xs: boolean }>`
  padding: 24px 0;
  margin: 0 ${(props) => (props.xs ? 24 : 0)}px;
`;

const SearchIcon = styled(SearchOutlined)`
  color: rgba(0, 0, 0, 0.25);
`;

const TagSearch = styled(Row)`
  margin-top: 8px;
`;

const AffixInner = styled.div<{ xs: boolean; affixed: boolean }>`
  background: ${(props) => (props.affixed ? '#FFFFFF' : 'transparent')};
  padding: ${(props) => (props.affixed && !props.xs ? '0 24px' : '0')};
  transition: all 150ms ease-in;
`;

const AlertOuter = styled.div<{ xs: boolean }>`
  margin: 0 ${(props) => (props.xs ? 24 : 0)}px;
`;

const enhance = compose(withLayout(Layout.DEFAULT));

interface Props {}

const Library: React.FC<Props> = enhance(() => {
  const dispatch = useDispatch<AppDispatch>();
  const errors = useSelector<RootState, string[]>((state) => state.library.errors);
  const notations = useSelector<RootState, NotationPreview[]>((state) => state.library.notations);
  const tags = useSelector<RootState, Tag[]>((state) => state.tag.tags);
  const pageInfo = useSelector<RootState, PageInfo>((state) => state.library.pageInfo);
  const xs = useSelector<RootState, boolean>((state) => state.viewport.xs);
  const hasNextPage = useSelector<RootState, boolean>(
    (state) => !state.library.isPending && Boolean(state.library.pageInfo.hasNextPage) && !state.library.errors.length
  );

  const [queryString, setQueryString] = useState('');
  const [queryTags, setQueryTags] = useState<{ [key: string]: boolean }>({});
  const isQueryClearAllowed = queryString.length > 0 || Object.values(queryTags).some((isChecked) => isChecked);
  const onQueryStringChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQueryString(event.target.value);
  }, []);
  const onQueryTagCheckChange = useCallback(
    (tagId: string) => (isChecked: boolean) =>
      setQueryTags({
        ...queryTags,
        [tagId]: isChecked,
      }),
    [queryTags]
  );
  const onQueryClear = useCallback(() => {
    setQueryString('');
    setQueryTags(mapValues(queryTags, () => false));
  }, [queryTags]);

  const [affixed, setAffixed] = useState(false);
  const onAffixChange = useCallback((affixed) => {
    setAffixed(affixed);
  }, []);

  const loadNextNotationPage = useCallback(() => {
    dispatch(getNotationPage({ first: PAGE_SIZE, after: pageInfo.endCursor }));
  }, [dispatch, pageInfo.endCursor]);

  const onAlertClose = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  useEffectOnce(() => {
    dispatch(getTags());
  });

  return (
    <Outer data-testid="library" xs={xs}>
      {errors.length ? (
        <AlertOuter xs={xs}>
          <Alert showIcon type="error" message={errors.join('; ')} closeText="try again" onClose={onAlertClose} />
        </AlertOuter>
      ) : null}

      <Affix onChange={onAffixChange}>
        <AffixInner xs={xs} affixed={affixed}>
          <Search xs={xs}>
            <Input
              value={queryString}
              onChange={onQueryStringChange}
              placeholder="song, artist, or transcriber name"
              prefix={<SearchIcon />}
              suffix={isQueryClearAllowed ? <CloseCircleOutlined onClick={onQueryClear} /> : null}
            />
            <TagSearch justify="center" align="middle">
              {tags.map((tag) => (
                <CheckableTag
                  key={tag.id}
                  checked={queryTags[tag.id] || false}
                  onChange={onQueryTagCheckChange(tag.id)}
                >
                  {tag.name}
                </CheckableTag>
              ))}
            </TagSearch>
          </Search>
        </AffixInner>
      </Affix>

      <Row justify="center">
        {isQueryClearAllowed ? (
          <Button type="link" size="small" onClick={onQueryClear}>
            remove filters
          </Button>
        ) : (
          <Button size="small">{/* Dummy button for DOM spacing */}</Button>
        )}
      </Row>

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

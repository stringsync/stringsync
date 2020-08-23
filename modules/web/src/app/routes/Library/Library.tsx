import { CloseCircleOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { compose, NotationConnectionArgs, PageInfo } from '@stringsync/common';
import { Tag } from '@stringsync/domain';
import { Affix, Alert, Button, Input, Row, Tag as AntdTag } from 'antd';
import { debounce, difference, mapValues } from 'lodash';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { NotationList } from './NotationList';
import { Layout, withLayout } from '../../../hocs';
import { useEffectOnce, usePrevious } from '../../../hooks';
import { AppDispatch, getTags, RootState } from '../../../store';
import { clearErrors, clearPages, getNotationPage } from '../../../store/library';
import { NotationPreview } from '../../../store/library/types';

const { CheckableTag } = AntdTag;

const PAGE_SIZE = 9;

const DEBOUNCE_DELAY_MS = 500;

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
  // store state
  const dispatch = useDispatch<AppDispatch>();
  const errors = useSelector<RootState, string[]>((state) => state.library.errors);
  const notations = useSelector<RootState, NotationPreview[]>((state) => state.library.notations);
  const tags = useSelector<RootState, Tag[]>((state) => state.tag.tags);
  const pageInfo = useSelector<RootState, PageInfo>((state) => state.library.pageInfo);
  const xs = useSelector<RootState, boolean>((state) => state.viewport.xs);
  const isPending = useSelector<RootState, boolean>((state) => state.library.isPending);
  const hasNextPage = useSelector<RootState, boolean>(
    (state) => !state.library.isPending && Boolean(state.library.pageInfo.hasNextPage) && !state.library.errors.length
  );

  // local state
  const [query, setQuery] = useState('');
  const prevQuery = usePrevious(query);
  const [isCheckedByTagId, setIsCheckedByTagId] = useState<{ [key: string]: boolean }>({});
  const [isSearching, setIsSearching] = useState(false);
  const [affixed, setAffixed] = useState(false);
  const [shouldLoadFirstPage, setShouldLoadFirstPage] = useState(true);
  const tagIds = Object.keys(isCheckedByTagId).filter((tagId) => isCheckedByTagId[tagId]);
  const prevTagIds = usePrevious(tagIds);
  const hasQueryOrTagChecked = Boolean(query.length || tagIds.length);
  const didQueryChange = typeof prevQuery !== 'undefined' && query !== prevQuery;
  const sortedTagIds = tagIds.sort();
  const sortedPrevTagIds = (prevTagIds || []).sort();
  const didTagIdsChange =
    difference(sortedTagIds, sortedPrevTagIds).length > 0 || difference(sortedPrevTagIds, sortedTagIds).length > 0;

  // callbacks
  const loadNextPage = useCallback(async () => {
    const connectionArgs: NotationConnectionArgs = { last: PAGE_SIZE, before: pageInfo.startCursor };
    if (query) {
      connectionArgs.query = query;
    }
    if (tagIds.length) {
      connectionArgs.tagIds = tagIds;
    }
    await dispatch(getNotationPage(connectionArgs));
    setIsSearching(false);
    setShouldLoadFirstPage(false);
  }, [dispatch, pageInfo.startCursor, query, tagIds]);

  const debouncedClearPages = useRef(
    debounce(() => {
      dispatch(clearPages());
      setShouldLoadFirstPage(true);
    }, DEBOUNCE_DELAY_MS)
  );

  const onQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  const onQueryTagCheckChange = useCallback(
    (tagId: string) => (isChecked: boolean) =>
      setIsCheckedByTagId({
        ...isCheckedByTagId,
        [tagId]: isChecked,
      }),
    [isCheckedByTagId]
  );

  const onQueryClear = useCallback(() => {
    setQuery('');
    setIsCheckedByTagId(mapValues(isCheckedByTagId, () => false));
  }, [isCheckedByTagId]);

  const onAffixChange = useCallback((affixed) => {
    setAffixed(affixed);
  }, []);

  const onAlertClose = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const isTagChecked = useCallback((id) => isCheckedByTagId[id] || false, [isCheckedByTagId]);

  // effects
  useEffectOnce(() => {
    dispatch(getTags());
  });

  useEffect(() => {
    if (didQueryChange || didTagIdsChange) {
      setIsSearching(true);
      debouncedClearPages.current();
    }
  }, [didQueryChange, didTagIdsChange]);

  useEffect(() => {
    if (shouldLoadFirstPage) {
      setShouldLoadFirstPage(false);
      loadNextPage();
    }
  }, [loadNextPage, shouldLoadFirstPage]);

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
              value={query}
              onChange={onQueryChange}
              placeholder="song, artist, or transcriber name"
              prefix={isSearching ? <LoadingOutlined /> : <SearchIcon />}
              suffix={hasQueryOrTagChecked ? <CloseCircleOutlined onClick={onQueryClear} /> : null}
            />
            <TagSearch justify="center" align="middle">
              {tags.map((tag) => (
                <CheckableTag
                  key={tag.id}
                  checked={isCheckedByTagId[tag.id] || false}
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
        {hasQueryOrTagChecked ? (
          <Button type="link" size="small" onClick={onQueryClear}>
            remove filters
          </Button>
        ) : (
          <Button size="small">{/* Dummy button for DOM spacing */}</Button>
        )}
      </Row>

      <br />
      <br />

      {isSearching ? null : (
        <NotationList
          isPending={isPending}
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
          notations={notations}
          query={query}
          hasNextPage={hasNextPage}
          loadNextPage={loadNextPage}
          isTagChecked={isTagChecked}
        />
      )}
    </Outer>
  );
});

export default Library;

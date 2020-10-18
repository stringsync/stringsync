import { compose, NotationConnectionArgs, PageInfo } from '@stringsync/common';
import { debounce, isEqual } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Layout, withLayout } from '../../../hocs';
import { useEffectOnce } from '../../../hooks';
import { AppDispatch, getTags, RootState } from '../../../store';
import { clearPages, getNotationPage, setQuery, setTagIds } from '../../../store/library';
import { NotationPreview } from '../../../store/library/types';
import { LibraryErrors } from './LibraryErrors';
import { LibrarySearch } from './LibrarySearch';
import { NotationList } from './NotationList';

const DEBOUNCE_DELAY_MS = 500;

const PAGE_SIZE = 9;

const Outer = styled.div<{ xs: boolean }>`
  margin: 24px ${(props) => (props.xs ? 0 : 24)}px;
`;

const enhance = compose(withLayout(Layout.DEFAULT));

interface Props {}

const Library: React.FC<Props> = enhance(() => {
  // store state
  const dispatch = useDispatch<AppDispatch>();
  const query = useSelector<RootState, string>(state => state.library.query);
  const tagIds = useSelector<RootState, Set<string>>(state => new Set<string>(state.library.tagIds), isEqual);
  const notations = useSelector<RootState, NotationPreview[]>((state) => state.library.notations);
  const pageInfo = useSelector<RootState, PageInfo>((state) => state.library.pageInfo);
  const xs = useSelector<RootState, boolean>((state) => state.viewport.xs);
  const isPending = useSelector<RootState, boolean>((state) => state.library.isPending);
  const hasErrors = useSelector<RootState, boolean>((state) => state.library.errors.length > 0);

  // local state
  const [isSearching, setIsSearching] = useState(false);
  const [isListVisible, setIsListVisible] = useState(true);

  // computed state
  const shouldLoadMore = Boolean(pageInfo.hasNextPage) && !isPending && !hasErrors;

  // callbacks
  const loadNextPage = useCallback(async () => {
    const connectionArgs: NotationConnectionArgs = { last: PAGE_SIZE, before: pageInfo.startCursor };
    if (query) {
      connectionArgs.query = query;
    }
    if (tagIds.size) {
      connectionArgs.tagIds = Array.from(tagIds);
    }
    await dispatch(getNotationPage(connectionArgs));
    setIsSearching(false);
  }, [dispatch, pageInfo.startCursor, query, tagIds]);

  const debouncedShowList = useCallback(
    debounce(() => {
      setIsListVisible(true);
    }, DEBOUNCE_DELAY_MS),
    []
  );

  const showListWhenStable = useCallback(() => {
    setIsListVisible(false);
    debouncedShowList();
  }, [debouncedShowList]);

  const onQueryChange = useCallback(
    (query: string) => {
      dispatch(setQuery({ query }));
      dispatch(clearPages());
      setIsSearching(true);
      showListWhenStable();
    },
    [dispatch, showListWhenStable]
  );

  const onTagIdsChange = useCallback(
    (tagIds: Set<string>) => {
      dispatch(setTagIds({ tagIds: Array.from(tagIds) }));
      dispatch(clearPages());
      setIsSearching(true);
      showListWhenStable();
    },
    [dispatch, showListWhenStable]
  );

  const isTagChecked = useCallback((tagId: string) => tagIds.has(tagId), [tagIds]);

  // effects
  useEffectOnce(() => {
    dispatch(getTags());
  });

  return (
    <Outer data-testid="library" xs={xs}>
      <LibraryErrors />

      <LibrarySearch
        query={query}
        tagIds={tagIds}
        isSearching={isSearching}
        onQueryChange={onQueryChange}
        onTagIdsChange={onTagIdsChange}
      />

      <br />
      <br />

      {isListVisible && (
        <NotationList
          isPending={isPending}
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
          notations={notations}
          query={query}
          shouldLoadMore={shouldLoadMore}
          loadNextPage={loadNextPage}
          isTagChecked={isTagChecked}
        />
      )}
    </Outer>
  );
});

export default Library;

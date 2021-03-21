import { CaretUpOutlined, CloseCircleOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Affix, Alert, BackTop, Button, Input, List, Row } from 'antd';
import CheckableTag from 'antd/lib/tag/CheckableTag';
import { isEqual, uniq, without } from 'lodash';
import React, { ChangeEventHandler, MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Tag } from '../../../domain';
import { Layout, withLayout } from '../../../hocs';
import { useDebounce, useEffectOnce, useIntersection } from '../../../hooks';
import { AppDispatch, getTags, RootState } from '../../../store';
import { compose } from '../../../util/compose';
import { NotationCard } from './NotationCard';
import { LibraryStatus } from './types';
import { useLibraryState } from './useLibraryState';

const DEBOUNCE_DELAY_MS = 500;
const CLEAR_ERRORS_ANIMATION_DELAY_MS = 500;
const PAGE_SIZE = 9;
const LOADER_TRIGGER_ID = 'loader-trigger';

const Outer = styled.div<{ xs: boolean }>`
  margin: 24px ${(props) => (props.xs ? 0 : 24)}px;
  margin-left: 0;
  margin-right: 0;
`;

const AffixInner = styled.div<{ xs: boolean; affixed: boolean }>`
  background: ${(props) => (props.affixed ? '#FFFFFF' : 'transparent')};
  padding: ${(props) => (props.affixed && !props.xs ? '0 24px' : '0')};
  transition: all 150ms ease-in;
`;

const Search = styled.div<{ xs: boolean }>`
  padding: 16px 0;
  margin: 0 ${(props) => (props.xs ? 16 : 0)}px;
`;

const TagSearch = styled(Row)`
  margin-top: 8px;
`;

const AlertOuter = styled.div<{ xs: boolean }>`
  margin: 0 ${(props) => (props.xs ? 24 : 0)}px;
`;

const LoadingIcon = styled(LoadingOutlined)`
  font-size: 5em;
  color: ${(props) => props.theme['@border-color']};
`;

const SearchIcon = styled(SearchOutlined)`
  color: rgba(0, 0, 0, 0.25);
`;

const InvisibleLoadingIcon = styled(LoadingIcon)`
  color: transparent;
`;

const NoMore = styled.h2`
  color: ${(props) => props.theme['@muted']};
`;

const StyledCheckableTag = styled(CheckableTag)`
  margin: 4px;
`;

const BackTopButton = styled.div`
  height: 40px;
  width: 40px;
  line-height: 40px;
  border-radius: 4px;
  background-color: ${(props) => props.theme['@primary-color']};
  color: #fff;
  text-align: center;
  font-size: 14px;
`;

const normalizeTagIds = (tagIds: string[]) => uniq(tagIds).sort();

const enhance = compose(withLayout(Layout.DEFAULT));

type Props = {};

export const Library: React.FC<Props> = enhance(() => {
  const dispatch = useDispatch<AppDispatch>();
  const xs = useSelector<RootState, boolean>((state) => state.viewport.xs);
  const sm = useSelector<RootState, boolean>((state) => state.viewport.sm);
  const tags = useSelector<RootState, Tag[]>((state) => state.tag.tags);

  const {
    errors,
    status,
    notations,
    pageInfo,
    isInitialized,
    loadMoreNotations,
    clearErrors,
    resetLibrary,
  } = useLibraryState();
  const [query, setQuery] = useState('');
  const [tagIds, setTagIds] = useState(new Array<string>());
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY_MS);
  const debouncedTagIds = useDebounce(tagIds, DEBOUNCE_DELAY_MS);
  const isQueryDebouncing = !isEqual(query, debouncedQuery);
  const isTagIdsDebouncing = !isEqual(tagIds, debouncedTagIds);
  const [affixed, setAffixed] = useState(false);
  const isLoaderTriggerVisible = useIntersection(LOADER_TRIGGER_ID);
  const errorMessage = errors.map((error) => error.message).join('; ');
  const hasErrors = errors.length > 0;
  const isLoading = status === LibraryStatus.PENDING;
  const hasSearchTerm = query.length > 0 || tagIds.length > 0;

  const tagIdsSet = useMemo(() => new Set(tagIds), [tagIds]);
  const isTagChecked = useCallback((tagId: string) => tagIdsSet.has(tagId), [tagIdsSet]);

  const onAffixChange = (affixed?: boolean) => {
    setAffixed(!!affixed);
  };

  const onQueryChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuery(event.target.value);
    if (isInitialized) {
      resetLibrary();
    }
  };

  const onTagIdsChange = (tagId: string) => (isChecked: boolean) => {
    let nextTagIds: string[];
    if (isChecked) {
      nextTagIds = normalizeTagIds([...tagIds, tagId]);
    } else {
      nextTagIds = normalizeTagIds(without([...tagIds], tagId));
    }
    if (!isEqual(tagIds, nextTagIds)) {
      setTagIds(nextTagIds);
    }
    if (isInitialized) {
      resetLibrary();
    }
  };

  const onSearchTermClear: MouseEventHandler<HTMLSpanElement> = (event) => {
    setQuery('');
    setTagIds([]);
    if (isInitialized) {
      resetLibrary();
    }
  };

  const onAlertClose = () => {
    setTimeout(clearErrors, CLEAR_ERRORS_ANIMATION_DELAY_MS);
  };

  useEffectOnce(() => {
    dispatch(getTags());
  });

  useEffect(() => {
    if (
      isLoaderTriggerVisible &&
      !isLoading &&
      !hasErrors &&
      !isQueryDebouncing &&
      !isTagIdsDebouncing &&
      pageInfo.hasNextPage
    ) {
      loadMoreNotations({
        last: PAGE_SIZE,
        before: pageInfo.startCursor,
        query: debouncedQuery.length ? debouncedQuery : null,
        tagIds: debouncedTagIds.length ? debouncedTagIds : null,
      });
    }
  }, [
    debouncedQuery,
    debouncedTagIds,
    hasErrors,
    isLoaderTriggerVisible,
    isLoading,
    isQueryDebouncing,
    isTagIdsDebouncing,
    loadMoreNotations,
    pageInfo.hasNextPage,
    pageInfo.startCursor,
  ]);

  return (
    <Outer data-testid="library" xs={xs}>
      <>
        <Affix onChange={onAffixChange}>
          <AffixInner xs={xs} affixed={affixed}>
            <Search xs={xs}>
              <Input
                value={query}
                onChange={onQueryChange}
                placeholder="song, artist, or transcriber name"
                prefix={<SearchIcon />}
                suffix={hasSearchTerm && <CloseCircleOutlined onClick={onSearchTermClear} />}
              />
              <TagSearch justify="center" align="middle">
                {tags.map((tag) => (
                  <StyledCheckableTag key={tag.id} checked={isTagChecked(tag.id)} onChange={onTagIdsChange(tag.id)}>
                    {tag.name}
                  </StyledCheckableTag>
                ))}
              </TagSearch>
            </Search>
          </AffixInner>
        </Affix>

        <Row justify="center">
          {hasSearchTerm ? (
            <Button type="link" size="small" onClick={onSearchTermClear}>
              remove filters
            </Button>
          ) : (
            <Button size="small">{/* Dummy button for DOM spacing */}</Button>
          )}
        </Row>
      </>

      {isInitialized && (
        <>
          <br />
          <br />

          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
            style={{ padding: xs || sm ? '16px' : 0, margin: '0 auto' }}
            dataSource={notations}
            rowKey={(notation) => notation.id}
            renderItem={(notation) => (
              <List.Item>
                <Link to={`/n/${notation.id}`}>
                  <NotationCard notation={notation} query={query} isTagChecked={isTagChecked} />
                </Link>
              </List.Item>
            )}
          />
        </>
      )}

      {/* When this is visible, trigger loading  */}
      <div id={LOADER_TRIGGER_ID}></div>
      {hasErrors && (
        <AlertOuter xs={xs}>
          <Alert showIcon type="error" message={errorMessage} closeText="try again" onClose={onAlertClose} />
        </AlertOuter>
      )}

      <br />
      <br />

      {pageInfo.hasNextPage && (
        <Row justify="center">{isLoading || !isInitialized ? <LoadingIcon /> : <InvisibleLoadingIcon />}</Row>
      )}

      {!pageInfo.hasNextPage && (
        <>
          {notations.length > 0 && (
            <Row justify="center">
              <NoMore>no more content</NoMore>
            </Row>
          )}
        </>
      )}

      <BackTop>
        <BackTopButton>
          <CaretUpOutlined />
        </BackTopButton>
      </BackTop>
    </Outer>
  );
});

export default Library;

import { CaretUpOutlined, CloseCircleOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { useMachine } from '@xstate/react';
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
import { scrollToTop } from '../../../util/scrollToTop';
import { libraryMachine, libraryModel } from './libraryMachine';
import { NotationCard } from './NotationCard';

const QUERY_DEBOUNCE_DELAY_MS = 500;
const TAG_IDS_DEBOUNCE_DELAY_MS = 1000;
const CLEAR_ERRORS_ANIMATION_DELAY_MS = 500;
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
  const [state, send] = useMachine(libraryMachine);
  const isIdle = state.value === 'idle';
  const isLoading = state.matches('streaming.loading');
  const hasErrors = state.context.errors.length > 0;
  const hasLoadedLastPage = state.value === 'done';
  const hasLoadedFirstPage = state.context.hasLoadedFirstPage;

  const dispatch = useDispatch<AppDispatch>();
  const xs = useSelector<RootState, boolean>((state) => state.viewport.xs);
  const sm = useSelector<RootState, boolean>((state) => state.viewport.sm);
  const tags = useSelector<RootState, Tag[]>((state) => state.tag.tags);

  const [query, setQuery] = useState('');
  const [tagIds, setTagIds] = useState(new Array<string>());
  const [affixed, setAffixed] = useState(false);

  const debouncedQuery = useDebounce(query, QUERY_DEBOUNCE_DELAY_MS);
  const debouncedTagIds = useDebounce(tagIds, TAG_IDS_DEBOUNCE_DELAY_MS);
  const isQueryDebouncing = !isEqual(query, debouncedQuery);
  const isTagIdsDebouncing = !isEqual(tagIds, debouncedTagIds);
  const isSearchTermDebouncing = isQueryDebouncing || isTagIdsDebouncing;

  const hasSearchTerm = query.length > 0 || tagIds.length > 0;
  const tagIdsSet = useMemo(() => new Set(tagIds), [tagIds]);
  const isTagChecked = useCallback((tagId: string) => tagIdsSet.has(tagId), [tagIdsSet]);
  const isLoaderTriggerVisible = useIntersection(LOADER_TRIGGER_ID);

  const onQueryChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuery(event.target.value);
    scrollToTop({ duration: 0 });
  };

  const onTagIdsChange = (tagId: string) => (isChecked: boolean) => {
    let nextTagIds: string[];
    if (isChecked) {
      nextTagIds = normalizeTagIds([...tagIds, tagId]);
    } else {
      nextTagIds = normalizeTagIds(without([...tagIds], tagId));
    }
    if (!isEqual(tagIds, nextTagIds)) {
      scrollToTop({ duration: 0 });
      setTagIds(nextTagIds);
    }
  };

  const onSearchTermClear: MouseEventHandler<HTMLSpanElement> = (event) => {
    setQuery('');
    setTagIds([]);
  };

  const onAffixChange = (affixed?: boolean) => {
    setAffixed(!!affixed);
  };

  const onAlertClose = () => {
    setTimeout(() => {
      send(libraryModel.events.retryLoadPage());
    }, CLEAR_ERRORS_ANIMATION_DELAY_MS);
  };

  useEffectOnce(() => {
    dispatch(getTags());
  });

  useEffect(() => {
    if (isIdle && !isSearchTermDebouncing) {
      send(libraryModel.events.loadPage());
    }
  }, [send, isIdle, isSearchTermDebouncing]);

  useEffect(() => {
    if (isLoaderTriggerVisible) {
      send(libraryModel.events.loadPage());
    }
  }, [send, isLoaderTriggerVisible]);

  useEffect(() => {
    send(libraryModel.events.setQueryArgs(query, tagIds));
  }, [send, query, tagIds]);

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

        <Row justify="center" align="middle">
          {hasSearchTerm ? (
            <Button type="link" size="small" onClick={onSearchTermClear}>
              remove filters
            </Button>
          ) : (
            <Button size="small">{/* Dummy button for DOM spacing */}</Button>
          )}
        </Row>
      </>
      {hasLoadedFirstPage && (
        <>
          <br />
          <br />

          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
            style={{ padding: xs || sm ? '16px' : 0, border: '1px solid rgba(255,255,255,0)' }}
            dataSource={state.context.notations}
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
      {!hasLoadedLastPage && <div id={LOADER_TRIGGER_ID}></div>}
      {hasErrors && (
        <AlertOuter xs={xs}>
          <Alert
            showIcon
            type="error"
            message={state.context.errors.map((error) => error.message).join('; ')}
            closeText="try again"
            onClose={onAlertClose}
          />
        </AlertOuter>
      )}
      <br />
      <br />

      <Row justify="center">{isIdle || isLoading ? <LoadingIcon /> : <InvisibleLoadingIcon />}</Row>

      {hasLoadedLastPage && (
        <>
          {state.context.notations.length > 0 && (
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

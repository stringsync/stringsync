import { LoadingOutlined } from '@ant-design/icons';
import { compose } from '@stringsync/common';
import { Alert, Button, List, Row } from 'antd';
import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, withLayout } from '../../../hocs';
import { useIntersection, usePrevious } from '../../../hooks';
import { RootState } from '../../../store';
import { scrollToTop } from '../../../util/scrollToTop';
import { LibrarySearch } from './LibrarySearch';
import { NotationCard } from './NotationCard';
import { LibraryStatus } from './types';
import { useLibraryState } from './useLibraryState';

const PAGE_SIZE = 9;

const LOADER_TRIGGER_ID = 'loader-trigger';

const CLEAR_ERRORS_ANIMATION_DELAY_MS = 500;

const SCROLL_DURATION_PER_PAGE_MS = 100;

const MAX_SCROLL_DURATION_MS = 1000;

const Outer = styled.div<{ xs: boolean }>`
  margin: 24px ${(props) => (props.xs ? 0 : 24)}px;
`;

const Icon = styled(LoadingOutlined)`
  font-size: 5em;
  color: ${(props) => props.theme['@border-color']};
`;

const InvisibleIcon = styled(Icon)`
  color: transparent;
`;

const AlertOuter = styled.div<{ xs: boolean }>`
  margin: 0 ${(props) => (props.xs ? 24 : 0)}px;
`;

const NoMore = styled.h2`
  color: ${(props) => props.theme['@muted']};
`;

const enhance = compose(withLayout(Layout.DEFAULT));

interface Props {}

const Library: React.FC<Props> = enhance(() => {
  const xs = useSelector<RootState, boolean>((state) => state.viewport.xs);

  const [isInitialized, setIsInitialized] = useState(false);
  const [query, setQuery] = useState('');
  const prevQuery = usePrevious(query);
  const [tagIds, setTagIds] = useState(new Set<string>());
  const prevTagIds = usePrevious(tagIds);
  const isLoading = useRef(false);
  const isLoaderTriggerVisible = useIntersection(LOADER_TRIGGER_ID);
  const { errors, status, notations, pageInfo, loadMoreNotations, clearErrors, clearNotations } = useLibraryState();
  const errorMessage = errors.map((error) => error.message).join('; ');

  const onQueryCommit = useCallback((nextQuery: string) => {
    setQuery(nextQuery);
  }, []);

  const onTagIdsCommit = useCallback((nextTagIds: Set<string>) => {
    setTagIds(nextTagIds);
  }, []);

  // allow the alert closing animation to play
  const onAlertClose = () => {
    setTimeout(clearErrors, CLEAR_ERRORS_ANIMATION_DELAY_MS);
  };

  const onBackToTopClick = () => {
    const numPages = Math.floor(notations.length / PAGE_SIZE);
    let totalScrollDurationMs = SCROLL_DURATION_PER_PAGE_MS * numPages;
    totalScrollDurationMs = Math.min(totalScrollDurationMs, MAX_SCROLL_DURATION_MS);
    scrollToTop({ duration: totalScrollDurationMs });
  };

  const isTagChecked = (tagId: string) => tagIds.has(tagId);

  // prevent the Load More antd List component placeholder from showing on initial load
  useEffect(() => {
    if (!isInitialized && status === LibraryStatus.SUCCESS) {
      setIsInitialized(true);
    }
  }, [isInitialized, status]);

  // react to when the loader trigger element is in view, meaning the user is at the bottom
  // of the page
  useEffect(() => {
    const isReadyForAnotherRequest =
      !isLoading.current && // is not loading from *this* components perspective
      (status === LibraryStatus.SUCCESS || status === LibraryStatus.IDLE);

    if (isLoaderTriggerVisible && isReadyForAnotherRequest && pageInfo.hasNextPage) {
      loadMoreNotations({
        last: PAGE_SIZE,
        before: pageInfo.startCursor,
        query: query.length ? query : null,
        tagIds: tagIds.size ? Array.from(tagIds) : null,
      });
    }
  }, [isLoaderTriggerVisible, loadMoreNotations, pageInfo.hasNextPage, pageInfo.startCursor, query, status, tagIds]);

  // synchronize library status (asynchronously updated) so that we don't have to wait on
  // React to rerender the DOM with the updated status value
  useEffect(() => {
    isLoading.current = status === LibraryStatus.PENDING;
  }, [status]);

  useEffect(() => {
    if (!isEqual(prevQuery, query) || !isEqual(prevTagIds, tagIds)) {
      clearNotations();
      setIsInitialized(false);
    }
  }, [clearNotations, prevQuery, prevTagIds, query, tagIds]);

  return (
    <Outer data-testid="library" xs={xs}>
      <LibrarySearch isInitialized={isInitialized} onQueryCommit={onQueryCommit} onTagIdsCommit={onTagIdsCommit} />
      {isInitialized && (
        <>
          <br />
          <br />

          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
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
      {status === LibraryStatus.ERROR && (
        <AlertOuter xs={xs}>
          <Alert showIcon type="error" message={errorMessage} closeText="try again" onClose={onAlertClose} />
        </AlertOuter>
      )}
      <br />
      <br />
      {pageInfo.hasNextPage && (
        <Row justify="center">{status === LibraryStatus.PENDING ? <Icon /> : <InvisibleIcon />}</Row>
      )}
      {!pageInfo.hasNextPage && (
        <>
          {notations.length > 0 && (
            <Row justify="center">
              <NoMore>no more content</NoMore>
            </Row>
          )}
          {notations.length >= 9 && (
            <Row justify="center">
              <Button size="large" type="primary" onClick={onBackToTopClick}>
                back to top
              </Button>
            </Row>
          )}
        </>
      )}
    </Outer>
  );
});

export default Library;

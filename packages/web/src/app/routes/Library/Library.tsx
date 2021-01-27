import { LoadingOutlined } from '@ant-design/icons';
import { compose } from '@stringsync/common';
import { Alert, Button, List, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, withLayout } from '../../../hocs';
import { useIntersection } from '../../../hooks';
import { RootState } from '../../../store';
import { scrollToTop } from '../../../util/scrollToTop';
import { LibrarySearch } from './LibrarySearch';
import { NotationCard } from './NotationCard';
import { LibraryStatus } from './types';
import { useLibraryState } from './useLibraryState';

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

const PAGE_SIZE = 9;

const LOADER_TRIGGER_ID = 'loader-trigger';

const CLEAR_ERRORS_ANIMATION_DELAY_MS = 500;

const enhance = compose(withLayout(Layout.DEFAULT));

interface Props {}

const Library: React.FC<Props> = enhance(() => {
  const xs = useSelector<RootState, boolean>((state) => state.viewport.xs);

  const [isInitialized, setIsInitialized] = useState(false);
  const [query, setQuery] = useState('');
  const [tagIds, setTagIds] = useState(new Array<string>());
  const isLoading = useRef(false);
  const isLoaderTriggerVisible = useIntersection(LOADER_TRIGGER_ID);
  const { errors, status, notations, pageInfo, loadMoreNotations, clearErrors } = useLibraryState();
  const errorMessage = errors.map((error) => error.message).join('; ');

  // allow the alert closing animation to play
  const delayedClearErrors = () => {
    setTimeout(clearErrors, CLEAR_ERRORS_ANIMATION_DELAY_MS);
  };

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
      loadMoreNotations({ last: PAGE_SIZE, before: pageInfo.startCursor });
    }
  }, [isLoaderTriggerVisible, loadMoreNotations, pageInfo.hasNextPage, pageInfo.startCursor, status]);

  // synchronize library status (asynchronously updated) so that we don't have to wait on
  // React to rerender the DOM with the updated status value
  useEffect(() => {
    isLoading.current = status === LibraryStatus.PENDING;
  }, [status]);

  return (
    <Outer data-testid="library" xs={xs}>
      <LibrarySearch />

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
                  <NotationCard notation={notation} query={''} isTagChecked={() => true} />
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
          <Alert showIcon type="error" message={errorMessage} closeText="try again" onClose={delayedClearErrors} />
        </AlertOuter>
      )}

      <br />
      <br />

      {pageInfo.hasNextPage && (
        <Row justify="center">{status === LibraryStatus.PENDING ? <Icon /> : <InvisibleIcon />}</Row>
      )}

      {!pageInfo.hasNextPage && (
        <>
          <Row justify="center">
            <NoMore>no more content</NoMore>
          </Row>
          <Row justify="center">
            <Button size="large" type="primary" onClick={scrollToTop}>
              back to top
            </Button>
          </Row>
        </>
      )}
    </Outer>
  );
});

export default Library;

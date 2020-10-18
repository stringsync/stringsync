import { compose } from '@stringsync/common';
import { debounce, isEqual } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Layout, withLayout } from '../../../hocs';
import { useDidMount } from '../../../hooks';
import { AppDispatch, RootState } from '../../../store';
import { LibraryErrors } from './LibraryErrors';
import { LibrarySearch } from './LibrarySearch';
import { NotationList } from './NotationList';

const DEBOUNCE_DELAY_MS = 500;

const Outer = styled.div<{ xs: boolean }>`
  margin: 24px ${(props) => (props.xs ? 0 : 24)}px;
`;

const enhance = compose(withLayout(Layout.DEFAULT));

interface Props {}

const Library: React.FC<Props> = enhance(() => {
  // store state
  const dispatch = useDispatch<AppDispatch>();
  const query = useSelector<RootState, string>((state) => state.library.query);
  const tagIds = useSelector<RootState, string[]>((state) => state.library.tagIds, isEqual);
  const xs = useSelector<RootState, boolean>((state) => state.viewport.xs);

  // local state
  const [isListVisible, setIsListVisible] = useState(true);
  const didMount = useDidMount();

  // callbacks
  const showList = () => {
    setIsListVisible(true);
  };

  const hideList = () => {
    setIsListVisible(false);
  };

  const debouncedShowList = useCallback(debounce(showList, DEBOUNCE_DELAY_MS), []);

  const showListWhenStable = useCallback(() => {
    debouncedShowList();
  }, [debouncedShowList]);

  // effects
  useEffect(() => {
    // avoid running this on mount, because it'll make the list hidden longer than
    // it needs to
    if (didMount) {
      hideList();
      showListWhenStable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tagIds, showListWhenStable, dispatch]);

  return (
    <Outer data-testid="library" xs={xs}>
      <LibraryErrors />

      <LibrarySearch />

      <br />
      <br />

      {isListVisible && <NotationList grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }} />}
    </Outer>
  );
});

export default Library;

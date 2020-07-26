import React from 'react';
import { compose, PageInfo } from '@stringsync/common';
import { Layout, withLayout } from '../../hocs';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { NotationPreview } from '../../store/library/types';
import { getNotationPage } from '../../store/library';
import { useEffectOnce } from '../../hooks';

const PAGE_SIZE = 10;

interface Props {}

const enhance = compose(withLayout(Layout.DEFAULT));

const Library: React.FC<Props> = enhance(() => {
  const dispatch = useDispatch<AppDispatch>();
  const notations = useSelector<RootState, NotationPreview[]>((state) => state.library.notations);
  const pageInfo = useSelector<RootState, PageInfo>((state) => state.library.pageInfo);

  useEffectOnce(() => {
    if (notations.length === 0 && pageInfo.hasNextPage) {
      dispatch(getNotationPage({ first: PAGE_SIZE, after: pageInfo.endCursor }));
    }
  });

  return <div data-testid="library">Library</div>;
});

export default Library;

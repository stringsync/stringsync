import { compose, PageInfo } from '@stringsync/common';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, withLayout } from '../../hocs';
import { useEffectOnce } from '../../hooks';
import { AppDispatch, RootState } from '../../store';
import { getNotationPage } from '../../store/library';
import { NotationPreview } from '../../store/library/types';

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

  return <div data-testid="library">{JSON.stringify(pageInfo, null, 2)}</div>;
});

export default Library;

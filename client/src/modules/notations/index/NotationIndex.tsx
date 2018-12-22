import * as React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import { Lane } from '../../../components/lane';
import { Grid } from './grid';
import { connect } from 'react-redux';
import { NotationsActions } from '../../../data/notations/notationsActions';
import { INotation } from '../../../@types/notation';
import withSizes from 'react-sizes';
import { Search } from './search';
import { isEqual } from 'lodash';
import { filterNotations } from './filterNotations';
import { IStore } from '../../../@types/store';
import { getNullNotations } from './getNullNotations';
import { fetchAllNotations } from '../../../data/notations/notationsApi';
import { BackTop } from 'antd';

interface IConnectProps {
  notations: INotation[];
  setNotations: (notations: INotation[]) => any;
}

interface IStateProps extends IConnectProps {
  queryString: string;
  queryTags: string[];
  queriedNotations: INotation[];
  loading: boolean;
  setQueryString: (queryString: string) => void;
  setQueryTags: (queryTags: string[]) => void;
  setQueriedNotations: (queriedNotations: INotation[]) => void;
  setLoading: (loading: boolean) => void;
}

interface ISizeProps extends IStateProps {
  isMobile: boolean;
}

const enhance = compose<ISizeProps, {}>(
  connect(
    (state: IStore) => ({ notations: state.notations }),
    dispatch => ({
      setNotations: (notations: INotation[]) => dispatch(NotationsActions.setNotations(notations))
    })
  ),
  withState('queryString', 'setQueryString', ''),
  withState('queryTags', 'setQueryTags', []),
  withState('queriedNotations', 'setQueriedNotations', []),
  withState('loading', 'setLoading', true),
  lifecycle<IStateProps, {}>({
    componentDidUpdate(prevProps): void {
      const didQueryChange = (
        this.props.queryString !== prevProps.queryString ||
        !isEqual(new Set(this.props.queryTags), new Set(prevProps.queryTags))
      );

      const isInitialLoad = this.props.loading && this.props.queriedNotations.length === 0;

      if (!didQueryChange && !isInitialLoad) {
        return;
      }

      const { queryString, queryTags, notations } = this.props;
      if (queryString.length > 0 || queryTags.length > 0) {
        this.props.setQueriedNotations(filterNotations(queryString, queryTags, notations));
      } else {
        this.props.setQueriedNotations(notations);
      }
    }
  }),
  lifecycle<IStateProps, {}>({
    async componentDidMount(): Promise<void> {
      this.props.setNotations(getNullNotations(12));
      const notations = await fetchAllNotations();
      // sorted in reverse
      const sorted = notations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      this.props.setNotations(sorted);
      this.props.setQueriedNotations(sorted);
      this.props.setLoading(false);
    }
  }),
  withSizes(size => ({ isMobile: withSizes.isMobile(size) }))
);

export const NotationIndex = enhance(props => (
  <Lane
    withPadding={!props.isMobile}
    withTopMargin={true}
  >
    <BackTop />
    <Search
      numQueried={props.queriedNotations.length}
      queryString={props.queryString}
      queryTags={props.queryTags}
      setQueryString={props.setQueryString}
      setQueryTags={props.setQueryTags}
    />
    <Grid
      queryTags={props.queryTags}
      notations={props.queriedNotations}
      loading={props.loading}
    />
  </Lane>
));

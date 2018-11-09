import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { ContentLane } from '../../../components/content-lane';
import { Grid } from './grid';
import { fetchAllNotations } from './fetchAllNotations';
import { connect } from 'react-redux';
import { NotationsActions } from '../../../data/notations/notationsActions';
import { INotation } from '../../../@types/notation';
import { IStore } from '../../../@types/store';

interface IConnectProps {
  notations: INotation[];
  setNotations: (notations: INotation[]) => any;
}

const enhance = compose<IConnectProps, {}>(
  connect(
    (state: IStore) => ({
      notations: state.notations
    }),
    dispatch => ({
      setNotations: (notations: INotation[]) => dispatch(NotationsActions.setNotations(notations))
    })
  ),
  lifecycle<IConnectProps, {}>({
    async componentDidMount() {
      const notations = await fetchAllNotations();
      const sorted = notations.
        sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).
        reverse();
      this.props.setNotations(sorted);
    }
  })
);

export const Index = enhance(props => (
  <ContentLane withTopMargin={true}>
    <Grid />
    {JSON.stringify(props.notations)}
  </ContentLane>
));

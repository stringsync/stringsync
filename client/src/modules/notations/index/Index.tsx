import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { ContentLane } from '../../../components/content-lane';
import { Grid } from './grid';
import { fetchAllNotations } from './fetchAllNotations';
import { connect } from 'react-redux';
import { NotationsActions } from '../../../data/notations/notationsActions';
import { INotation } from '../../../@types/notation';
import { IStore } from '../../../@types/store';
import withSizes from 'react-sizes';

interface IConnectProps {
  notations: INotation[];
  setNotations: (notations: INotation[]) => any;
}

interface ISizeProps extends IConnectProps {
  isMobile: boolean;
}

const enhance = compose<ISizeProps, {}>(
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
      // sorted in reverse
      const sorted = notations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      this.props.setNotations(sorted);
    }
  }),
  withSizes(size => ({ isMobile: withSizes.isMobile(size) }))
);

export const Index = enhance(props => (
  <ContentLane
    withPadding={!props.isMobile}
    withTopMargin={true}
  >
    <Grid notations={props.notations} />
  </ContentLane>
));

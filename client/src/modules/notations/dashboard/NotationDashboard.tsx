import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { Lane } from '../../../components/lane/Lane';
import { INotation } from '../../../@types/notation';
import { connect } from 'react-redux';
import { IStore } from '../../../@types/store';
import { NotationsActions } from '../../../data/notations/notationsActions';
import { fetchAllNotations } from '../../../data/notation/notationApi';

interface IStateProps {
  notations: INotation[];
}

interface IDispatchProps {
  setNotations: (notations: INotation[]) => void;
}

type InnerProps = IStateProps & IDispatchProps;

const enhance = compose<InnerProps, {}>(
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      notations: state.notations
    }),
    dispatch => ({
      setNotations: (notations: INotation[]) => dispatch(NotationsActions.setNotations(notations))
    })
  ),
  lifecycle<InnerProps, {}, {}>({
    async componentDidMount(): Promise<void> {
      const notations = await fetchAllNotations('all');
      const sorted = notations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      this.props.setNotations(sorted);
    }
  })
);

export const NotationDashboard = enhance(props => (
  <Lane withTopMargin={true} withPadding={true}>
    NotationDashboard
  </Lane>
));

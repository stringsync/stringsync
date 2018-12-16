import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { IStore } from '../../../@types/store';
import { INotation } from '../../../@types/notation';
import { NotationsActions } from '../../../data/notations';
import { fetchAllNotations } from '../../../data/notations/notationsApi';
import { Box } from '../../../components/box';

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
      // Only fetch if we need to
      if (this.props.notations.length > 0) {
        return;
      }

      const notations = await fetchAllNotations();
      // sorted in reverse
      const sorted = notations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      this.props.setNotations(sorted);
    }
  }),
);

export const Suggestions = enhance(props => (
  <div>Suggestions</div>
));

import * as React from 'react';
import { compose, withState, lifecycle, branch, renderComponent } from 'recompose';
import { fetchNotation } from '../../../data/notation/notationApi';
import { RouteComponentProps } from 'react-router';
import { INotation } from '../../../@types/notation';
import { connect } from 'react-redux';
import { IStore } from '../../../@types/store';
import { NotationActions } from '../../../data/notation/notationActions';
import styled from 'react-emotion';
import { Loading } from '../../../components/loading/Loading';

interface IConnectProps extends RouteComponentProps<{ id: string }> {
  notation: INotation;
  setNotation: (notation: INotation) => void;
  resetNotation: () => void;
}

interface IStateProps extends IConnectProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const enhance = compose<IStateProps, RouteComponentProps> (
  connect(
    (state: IStore) => ({
      notation: state.notation
    }),
    dispatch => ({
      setNotation: (notation: INotation) => dispatch(NotationActions.setNotation(notation)),
      resetNotation: () => dispatch(NotationActions.resetNotation())
    })
  ),
  withState('loading', 'setLoading', true),
  lifecycle<IStateProps, {}, {}>({
    async componentDidMount(): Promise<void> {
      const paramsId = this.props.match.params.id;

      try {
        const notationId = parseInt(paramsId, 10);

        if (isNaN(notationId)) {
          throw new Error(`'${paramsId}' is not a valid notation id`);
        }

        const notation = await fetchNotation(notationId);
        this.props.setNotation(notation);
        this.props.setLoading(false);
      } catch (error) {
        console.error(error);
        window.ss.message.error(`could not load notation '${paramsId}'`);
        this.props.history.push('/');
      }
    },
    componentWillUnmount(): void {
      this.props.resetNotation();
    }
  })
);

const Center = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const NotationShow = enhance(props => (
  <div>
    <Loading loading={props.loading} />
    <div>NotationShow</div>
  </div>
));

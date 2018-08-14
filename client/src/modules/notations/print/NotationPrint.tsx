import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { fetchNotation, NotationsActions } from 'data';
import styled from 'react-emotion';
import { Score, MaestroController } from 'components';

interface IInnerProps extends RouteComponentProps<{ id: string }> {
  notation: Notation.INotation
  fetchNotation: (id: number) => void;
  resetNotationShow: () => void;
}

const enhance = compose<IInnerProps, {}>(
  withRouter,
  connect(
    (state: StringSync.Store.IState) => ({
      notation: state.notations.show
    }),
    (dispatch: Dispatch) => ({
      fetchNotation: (id: number) => dispatch(fetchNotation(id) as any),
      resetNotationShow: () => dispatch(NotationsActions.resetNotationShow())
    })
  ),
  lifecycle<IInnerProps, {}>({
    componentWillMount(): void {
      this.props.resetNotationShow();
    },
    async componentDidMount() {
      try {
        const notationId = parseInt(this.props.match.params.id, 10);
        await this.props.fetchNotation(notationId);
      } catch (error) {
        console.error(error);
        window.ss.message.error('could not fetch notation');
        this.props.history.push(`/n/${this.props.match.params.id}`)
      }
    },
    componentWillUnmount(): void {
      this.props.resetNotationShow();
    },
  }),
)

const Outer = styled('div')`
  @media print {

    #score {
      overflow: visible;

      .score-line {
        margin-bottom: 24px;
      }
    }

    #nav, #footer {
      display: none;
    }
  }
`;

export const NotationPrint = enhance(props => (
  <Outer>
    <MaestroController
      bpm={props.notation.bpm}
      deadTimeMs={props.notation.deadTimeMs}
      durationMs={props.notation.durationMs}
    />
    <Score
      dynamic={false}
      notation={props.notation}
      width={900}  
    />
  </Outer>
));

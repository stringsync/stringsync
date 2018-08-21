import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { fetchNotation, NotationActions } from 'data';
import styled from 'react-emotion';
import { Score, MaestroController } from 'components';
import { Link } from 'react-router-dom';

interface IInnerProps extends RouteComponentProps<{ id: string }> {
  notation: Notation.INotation
  fetchNotation: (id: number) => void;
  resetNotation: () => void;
}

const enhance = compose<IInnerProps, {}>(
  withRouter,
  connect(
    (state: Store.IState) => ({
      notation: state.notation
    }),
    (dispatch: Dispatch) => ({
      fetchNotation: (id: number) => dispatch(fetchNotation(id) as any),
      resetNotation: () => dispatch(NotationActions.resetNotation())
    })
  ),
  lifecycle<IInnerProps, {}>({
    async componentDidMount() {
      this.props.resetNotation();

      try {
        const notationId = parseInt(this.props.match.params.id, 10);
        await this.props.fetchNotation(notationId);
      } catch (error) {
        console.error(error);
        window.ss.message.error('could not fetch notation');
        this.props.history.push(`/n/${this.props.match.params.id}`)
      }
    }
  }),
)

const Outer = styled('div')`
  width: 1200px;
  margin: 0 auto;

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

const Inner = styled('div')`
  width: 100%;
  background: white;
  padding: 48px;
`;

export const Print = enhance(props => (
  <Outer>
    <Inner>
      <Link to={`/n/${props.match.params.id}`} className="print-hidden">back</Link>
      <MaestroController
        bpm={props.notation.bpm}
        deadTimeMs={props.notation.deadTimeMs}
        durationMs={props.notation.durationMs}
      />
      <Score
        selector={false}
        dynamic={false}
        notation={props.notation}
        width={900}  
      />
    </Inner>
  </Outer>
));

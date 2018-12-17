import * as React from 'react';
import { compose, lifecycle, branch, renderNothing } from 'recompose';
import { connect } from 'react-redux';
import { NotationsActions } from '../../../../data/notations';
import { fetchAllNotations } from '../../../../data/notations/notationsApi';
import styled from 'react-emotion';
import { INotation } from '../../../../@types/notation';
import { IStore } from '../../../../@types/store';
import { Item } from './Item';

interface IStateProps {
  focusedNotation: INotation;
  notations: INotation[];
}

interface IDispatchProps {
  setNotations: (notations: INotation[]) => void;
}

type InnerProps = IStateProps & IDispatchProps;

const enhance = compose<InnerProps, {}>(
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      focusedNotation: state.notation,
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
  branch<InnerProps>(
    props => props.notations.length === 0,
    renderNothing
  )
);

const Outer = styled('ul')`
  margin: 0 auto;
  width: 100%;
  padding-bottom: 64px;
`;

export const Suggestions = enhance(props => (
  <Outer>
    {props.notations.map(notation => (
      <Item key={notation.id as number} notation={notation} focusedNotation={props.focusedNotation} />
    ))}
  </Outer>
));

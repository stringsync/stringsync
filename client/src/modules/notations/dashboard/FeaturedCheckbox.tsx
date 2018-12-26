import * as React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { Checkbox } from 'antd';
import { connect } from 'react-redux';
import { INotation } from '../../../@types/notation';
import { IStore } from '../../../@types/store';
import { NotationsActions } from '../../../data/notations/notationsActions';
import { updateNotation } from '../../../data/notation/notationApi';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

interface IProps {
  notation: INotation;
}

interface IStateProps {
  notations: INotation[];
}

interface IDispatchProps {
  setNotations: (notations: INotation[]) => void;
}

type ConnectProps = IStateProps & IDispatchProps;

interface IWithStateProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

interface IHandlerProps {
  updateNotation: (event: CheckboxChangeEvent) => Promise<void>;
}

type InnerProps = IProps & ConnectProps & IWithStateProps & IHandlerProps;

const enhance = compose<InnerProps, IProps>(
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      notations: state.notations
    }),
    dispatch => ({
      setNotations: (notations: INotation[]) => dispatch(NotationsActions.setNotations(notations))
    })
  ),
  withState('loading', 'setLoading', false),
  withHandlers<IProps & ConnectProps & IWithStateProps, IHandlerProps>({
    updateNotation: props => async event => {
      if (typeof props.notation.id === 'undefined') {
        return;
      }

      props.setLoading(true);

      try {
        const notation = await updateNotation(props.notation.id, {
          featured: event.target.checked
        });

        const notations = [...props.notations];
        const ndx = notations.findIndex(n => n.id === props.notation.id);
        notations[ndx] = notation;

        props.setNotations(notations);

        window.ss.message.success(`updated notation '${props.notation.id}'`);
      } catch (error) {
        console.error(error.message);
        window.ss.message.success(`could not update notation '${props.notation.id}'`);
      } finally {
        props.setLoading(false);
      }
    }
  })
);

export const FeaturedCheckbox = enhance(props => (
  <Checkbox
    onChange={props.updateNotation}
    checked={props.notation.featured}
    disabled={props.loading || typeof props.notation.id === 'undefined'}
  />
));

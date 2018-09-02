import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import TextArea from 'antd/lib/input/TextArea';
import { connect, Dispatch } from 'react-redux';
import { updateNotation, NotationActions } from 'data';

const enhance = compose<any, any>(
  connect(
    (state: Store.IState) => ({
      notationId: state.notation.id,
      vextabString: state.notation.vextabString
    }),
    (dispatch: Dispatch) => ({
      setVextabString: (vextabString: string) => dispatch(NotationActions.setVextabString(vextabString)),
      updateVextabString: (notationId: number, vextabString: string) => (
        dispatch(updateNotation(notationId, { vextab_string: vextabString }) as any)
      )
    })
  ),
  withHandlers({
    handleChange: (props: any) => (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
      const vextabString = event.currentTarget.value;

      if (props.vextabString !== vextabString) {
        props.setVextabString(vextabString);
        props.updateVextabString(props.notationId, vextabString);
      }
    }
  })
);

export const VextabStringEditor = enhance(props => (
  <TextArea
    onChange={props.handleChange}
    value={props.vextabString}
  />
));
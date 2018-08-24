import { compose, withHandlers } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { Vextab } from 'models';
import { NotationActions } from 'data';
import { ComponentClass } from 'react';

interface IConnectProps {
  vextab: Vextab;
  setVextabString: (vextabString: string) => void;
}

export interface IWithVextabProps extends IConnectProps {
  getVextab: () => Vextab;
  setVextab: (vextab: Vextab) => void;
}

/**
 * This component adds the setter and getters for the notation.vextabString in
 * the redux store.
 * 
 * @param BaseComponent
 */
export const withVextab = <TProps>(BaseComponent: ComponentClass<TProps>) => {
  const enhance = compose<TProps, IWithVextabProps & TProps>(
    connect(
      (state: Store.IState) => ({
        vextab: state.editor.vextab
      }),
      (dispatch: Dispatch) => ({
        setVextabString: (vextabString: string) => dispatch(NotationActions.setVextabString(vextabString))
      })
    ),
    withHandlers({
      getVextab: (props: TProps & IWithVextabProps) => () => {
        return props.vextab.clone();
      },
      setVextab: (props: TProps & IWithVextabProps) => (vextab: Vextab) => {
        props.setVextabString(vextab.toString());
      }
    })
  );

  return enhance(BaseComponent)
}

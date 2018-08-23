import { compose, withHandlers } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { Vextab } from 'models';
import { NotationActions } from 'data';
import { ComponentClass } from 'react';

interface IConnectProps {
  setVextabString: (vextabString: string) => void;
}

export interface IWithVextabProps extends IConnectProps {
  getVextabClone: () => Vextab;
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
      null,
      (dispatch: Dispatch) => ({
        setVextabString: (vextabString: string) => dispatch(NotationActions.setVextabString(vextabString))
      })
    ),
    withHandlers({
      getVextabClone: () => () => {
        const { vextab } = window.ss.maestro;

        if (!vextab) {
          throw new Error('expected vextab to be set on maestro');
        }

        const clone = vextab.clone();
        clone.psuedorender();
        return clone;
      },
      setVextab: (props: TProps & IWithVextabProps) => (vextab: Vextab) => {
        props.setVextabString(vextab.toString());
      }
    })
  );

  return enhance(BaseComponent)
}

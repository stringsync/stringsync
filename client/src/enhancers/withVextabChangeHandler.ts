import { compose, withHandlers } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { Vextab } from 'models';
import { NotationActions } from 'data';
import { ComponentClass } from 'react';

interface IConnectProps {
  vextab: Vextab;
  setVextabString: (vextabString: string) => void;
}

interface IVextabAccessorProps extends IConnectProps {
  getVextab: () => Vextab;
  setVextab: (vextab: Vextab) => void;
}

export type VextabChangeHandler<TEvent = any> = (e: TEvent, vextab: Vextab) => Vextab;

export interface IWithVextabProps<TEvent = any> extends IVextabAccessorProps {
  handleVextabChange: VextabChangeHandler<TEvent>;
}

/**
 * This component adds the setter and getters for the notation.vextabString in
 * the redux store.
 * 
 * @param BaseComponent
 */
export const withVextabChangeHandler = <TEvent>(vextabUpdater: VextabChangeHandler<TEvent>) => (
  <TProps>(BaseComponent: ComponentClass<TProps>) => {
    const enhance = compose<TProps, IWithVextabProps<TEvent> & TProps>(
      connect(
        (state: Store.IState) => ({
          vextab: state.editor.vextab
        }),
        (dispatch: Dispatch) => ({
          setVextabString: (vextabString: string) => dispatch(NotationActions.setVextabString(vextabString))
        })
      ),
      withHandlers({
        getVextab: (props: TProps & IWithVextabProps<TEvent>) => () => {
          return props.vextab.clone();
        },
        setVextab: (props: TProps & IWithVextabProps<TEvent>) => (vextab: Vextab) => {
          props.setVextabString(vextab.toString());
        }
      }),
      withHandlers({
        handleVextabChange: (props: IWithVextabProps<TEvent>) => (e: TEvent) => {
          const vextab = props.getVextab();
          const updatedVextab = vextabUpdater(e, vextab);
          props.setVextab(updatedVextab)
        }
      })
    );

    return enhance(BaseComponent);
  }
);

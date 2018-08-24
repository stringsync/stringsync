import { compose, withHandlers, mapProps } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { Vextab } from 'models';
import { NotationActions } from 'data';
import { ComponentClass } from 'react';

export type VextabChangeHandler<TEvent> = (e: TEvent, vextab: Vextab) => Vextab;

interface IVextabUpdaterProps<TEvent> {
  $vextabUpdater: VextabChangeHandler<TEvent>
}

interface IConnectProps<TEvent> extends IVextabUpdaterProps<TEvent> {
  $vextab: Vextab;
  $setVextabString: (vextabString: string) => void;
}

interface IVextabAccessorProps<TEvent> extends IConnectProps<TEvent> {
  $getVextab: () => Vextab;
  $setVextab: (vextab: Vextab) => void;
}

export interface IWithVextabChangeHandlerProps<TEvent> {
  handleVextabChange: VextabChangeHandler<TEvent>;
}

/**
 * This component adds the setter and getters for the notation.vextabString in
 * the redux store.
 * 
 * @param BaseComponent
 */
export const withVextabChangeHandler = <TEvent, TProps>(vextabUpdater: (props: TProps) => VextabChangeHandler<TEvent>) => (
  (BaseComponent: ComponentClass<TProps>) => {
    const enhance = compose<TProps, TProps & IWithVextabChangeHandlerProps<TEvent>>(
      withHandlers({ $vextabUpdater: vextabUpdater }),
      connect(
        (state: Store.IState) => ({
          $vextab: state.editor.vextab
        }),
        (dispatch: Dispatch) => ({
          $setVextabString: (vextabString: string) => dispatch(NotationActions.setVextabString(vextabString))
        })
      ),
      withHandlers({
        $getVextab: (props: TProps & IConnectProps<TEvent>) => () => {
          return props.$vextab.clone();
        },
        $setVextab: (props: TProps & IConnectProps<TEvent>) => (vextab: Vextab) => {
          props.$setVextabString(vextab.toString());
        }
      }),
      withHandlers({
        handleVextabChange: (props: TProps & IVextabAccessorProps<TEvent>) => (e: TEvent) => {
          const vextab = props.$getVextab();
          const updatedVextab = props.$vextabUpdater(e, vextab);
          props.$setVextab(updatedVextab)
        }
      }),
      // Should only have handleVextabChange as a result of using this
      // enhancer
      mapProps((props: TProps & IVextabAccessorProps<TEvent> & IWithVextabChangeHandlerProps<TEvent>) => {
        const nextProps = Object.assign({}, props);

        delete nextProps.$setVextabString
        delete nextProps.$getVextab;
        delete nextProps.$setVextab;
        delete nextProps.$vextabUpdater;

        return nextProps;
      })
    );

    return enhance(BaseComponent);
  }
);

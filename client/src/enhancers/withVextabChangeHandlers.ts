import { compose, withHandlers, mapProps } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { Vextab } from 'models';
import { NotationActions } from 'data';
import { ComponentClass } from 'react';

/**
 * Returning a vextab will result in an update. Returning undefined does not.
 */
export type VextabChangeHandler<TEvent> = (e: TEvent, vextab: Vextab) => Vextab | void;

type VextabUpdater<TEvent, TProps> = (props: TProps) => VextabChangeHandler<TEvent>;

interface IVextabUpdaters<TEvent, TProps> {
  [handlerName: string]: VextabUpdater<TEvent, TProps>;
}

interface IConnectProps {
  $vextab: Vextab;
  $setVextabString: (vextabString: string) => void;
}

interface IVextabAccessorProps extends IConnectProps {
  $getVextab: () => Vextab;
  $setVextab: (vextab: Vextab) => void;
}

/**
 * This enhancer has a similar signature as recompose's withHandlers, with the exception
 * that the handlers return Vextab objects.
 * 
 * The returned Vextab objects are used to update the Redux store's notation.vextabString.
 * 
 * @param BaseComponent
 */
export const withVextabChangeHandlers = <TEvent, TProps>(vextabUpdaters: IVextabUpdaters<TEvent, TProps>) => (
  (BaseComponent: ComponentClass<TProps>) => {
    const enhance = compose<TProps, TProps & keyof IVextabUpdaters<TEvent, TProps>>(
      connect(
        (state: Store.IState) => ({
          $vextab: state.editor.vextab
        }),
        (dispatch: Dispatch) => ({
          $setVextabString: (vextabString: string) => dispatch(NotationActions.setVextabString(vextabString))
        })
      ),
      withHandlers({
        $getVextab: (props: TProps & IConnectProps) => () => {
          return props.$vextab.clone();
        },
        $setVextab: (props: TProps & IConnectProps) => (vextab: Vextab) => {
          props.$setVextabString(vextab.toString());
        }
      }),
      withHandlers(() => Object.keys(vextabUpdaters).reduce((handlers, handlerName) => {
        handlers[handlerName] = (props: TProps & IVextabAccessorProps) => (e: TEvent) => {
          const vextab = props.$getVextab();
          const updater = vextabUpdaters[handlerName](props);
          const updatedVextab = updater(e, vextab);

          if (updatedVextab) {
            props.$setVextab(updatedVextab);
          }
        }

        return handlers;
      }, {})),
      mapProps((props: TProps & IVextabAccessorProps) => {
        const nextProps = Object.assign({}, props);

        delete nextProps.$setVextabString
        delete nextProps.$getVextab;
        delete nextProps.$setVextab;
        delete nextProps.$vextab;

        return nextProps;
      })
    );

    return enhance(BaseComponent);
  }
);

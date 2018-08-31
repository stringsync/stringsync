import { compose, withHandlers, mapProps } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { Vextab } from 'models';
import { NotationActions } from 'data';
import { ComponentClass } from 'react';
import { Editor } from 'models/vextab/Editor';

export type VextabEditorHandler<TEvent> = (event: TEvent, editor: Editor) => any;

type VextabUpdater<TEvent, TProps> = (props: TProps) => VextabEditorHandler<TEvent>;

interface IVextabUpdaters<TEvent, TProps> {
  [handlerName: string]: VextabUpdater<TEvent, TProps>;
}

interface IOwnProps<TProps> {
  ownProps: TProps;
}

interface IConnectProps<TProps> extends IOwnProps<TProps> {
  vextab: Vextab;
  elementIndex: number;
  setVextabString: (vextabString: string) => void;
}

/**
 * This enhancer abstracts the overhead involved in updating a vextab. Its responsibility
 * is to clone the vextab in the store's editor state, create a Vextab editor, and pass that
 * to a handler, vextabUpdaters, which will potentionally update the Vextab state. This
 * enhancer will detect changes and conditionally update the vextabString in the notation
 * store state.
 * 
 * This enhancer will only add the vextabUpdaters, which can be used as handlers.
 * 
 * @param vextabUpdaters See the handlerCreators function signature of recompose.withHandlers
 * 
 * https://github.com/acdlite/recompose/blob/master/docs/API.md#withhandlers
 */
export const withEditorHandlers = <TEvent, TProps>(vextabUpdaters: IVextabUpdaters<TEvent, TProps>) => (
  (BaseComponent: ComponentClass<TProps>) => {
    const enhance = compose<TProps, TProps & keyof IVextabUpdaters<TEvent, TProps>>(
      // We separate our ownProps so we can create vextabUpdaters with them
      mapProps(props => ({ ownProps: Object.assign({}, props) })),
      connect(
        (state: Store.IState) => ({
          elementIndex: state.editor.elementIndex,
          vextab: state.editor.vextab
        }),
        (dispatch: Dispatch) => ({
          setVextabString: (vextabString: string) => dispatch(NotationActions.setVextabString(vextabString))
        })
      ),
      withHandlers(() => Object.keys(vextabUpdaters).reduce((handlers, handlerName) => {
        handlers[handlerName] = (props: IConnectProps<TProps>) => (e: TEvent) => {
          const vextab = props.vextab.clone();
          const editor = new Editor(vextab);

          // By default, the path is null, which results in null editor targets.
          if (typeof props.elementIndex === 'number') {
            editor.elementIndex = props.elementIndex;
          }

          // This is the implementation details to preserve the withHandlers-like syntax of
          // the enhancer.
          const handler = vextabUpdaters[handlerName];
          const updater = handler(props.ownProps);

          // This is the primary purpose of the enhancer. The cloned vextab will potentionally
          // be updated via the enhancer
          updater(e, editor);

          // Minor optimization: don't update the vextabString if nothing was changed
          const vextabString = props.vextab.toString();
          const nextVextabString = editor.vextabString;

          if (vextabString !== nextVextabString) {
            props.setVextabString(nextVextabString);
          }
        }

        return handlers;
      }, {})),
      // FIXME: Fix the props type here. It should include the withHandlers props, which
      // varies based on the vextabUpdaters argument.
      mapProps((props: IConnectProps<TProps>) => { 
        const nextProps = Object.assign({}, props);

        delete nextProps.setVextabString
        delete nextProps.vextab;
        delete nextProps.elementIndex;

        return nextProps;
      })
    );

    return enhance(BaseComponent);
  }
);

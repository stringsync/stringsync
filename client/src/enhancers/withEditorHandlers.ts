import { compose, withHandlers, mapProps } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { Vextab, Editor } from 'models';
import { NotationActions, EditorActions, IUpdateNotation, updateNotation } from 'data';
import { ComponentClass } from 'react';

export type VextabEditorHandler<TEvent> = (event: TEvent, editor: Editor) => any;

type VextabUpdater<TEvent, TProps> = (props: TProps) => VextabEditorHandler<TEvent>;

interface IVextabUpdaters<TEvent, TProps> {
  [handlerName: string]: VextabUpdater<TEvent, TProps>;
}

interface IOwnProps<TProps> {
  ownProps: TProps;
}

interface IConnectProps<TProps> extends IOwnProps<TProps> {
  autosave: boolean;
  enabled: boolean;
  vextab: Vextab;
  elementIndex: number;
  notationId: number;
  appendErrors: (errors: string[]) => void;
  notifyUpdated: () => void;
  removeErrors: () => void;
  setElementIndex: (elementIndex: number) => void;
  setEnabled: (enabled: boolean) => void;
  setVextabString: (vextabString: string) => void;
  updateVextabString: (notationId: number, vextabString: string) => void;
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
          autosave: state.editor.autosave,
          elementIndex: state.editor.elementIndex,
          enabled: state.editor.enabled,
          notationId: state.notation.id,
          vextab: state.editor.vextab
        }),
        (dispatch: Dispatch) => ({
          appendErrors: (errors: string[]) => dispatch(EditorActions.appendErrors(errors)),
          notifyUpdated: () => dispatch(EditorActions.notifyUpdated()),
          removeErrors: () => dispatch(EditorActions.removeErrors()),
          setElementIndex: (elementIndex: number) => dispatch(EditorActions.setElementIndex(elementIndex)),
          setEnabled: (enabled: boolean) => dispatch(EditorActions.setEnabled(enabled)),
          setVextabString: (vextabString: string) => dispatch(NotationActions.setVextabString(vextabString)),
          updateVextabString: (notationId: number, vextabString: string) => (
            dispatch(updateNotation(notationId, { vextab_string: vextabString }) as any)
          )
        })
      ),
      withHandlers(() => Object.keys(vextabUpdaters).reduce((handlers, handlerName) => {
        handlers[handlerName] = (props: IConnectProps<TProps>) => async (e: TEvent) => {
          const vextab = props.vextab.clone();
          vextab.psuedorender();
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
          try {
            updater(e, editor);
          } catch (error) {
            props.appendErrors([error.message]);
            return;
          }

          props.removeErrors();

          // Minor optimization: don't update the vextabString if nothing was changed
          const vextabString = props.vextab.toString();
          const nextVextabString = editor.vextabString;

          if (vextabString !== nextVextabString) {
            props.setVextabString(nextVextabString);
          }

          // Focus the new measure
          const nextElementIndex = typeof editor.elementIndex === 'number' ? editor.elementIndex : -1;
          props.setElementIndex(nextElementIndex);

          // If the editor vextab can render and autosave is on, issue a save
          if (props.autosave && typeof props.notationId === 'number') {
            const wasEnabled = props.enabled;

            try {
              const nextVextab = editor.vextab.clone();
              nextVextab.psuedorender();

              props.setEnabled(false);
              await props.updateVextabString(props.notationId, nextVextab.toString());
              props.notifyUpdated();
            } catch (error) {
              console.error(error);
              window.ss.message.error('vextab did not autosave');
            } finally {
              props.setEnabled(wasEnabled);
            }
          }
        }

        return handlers;
      }, {})),
      // FIXME: Fix the props type here. It should include the withHandlers props, which
      // varies based on the vextabUpdaters argument.
      mapProps((props: IConnectProps<TProps>) => { 
        const nextProps = Object.assign({}, props, props.ownProps);

        delete nextProps.setVextabString
        delete nextProps.vextab;
        delete nextProps.elementIndex;
        delete nextProps.ownProps;
        delete nextProps.appendErrors;
        delete nextProps.removeErrors;
        delete nextProps.setElementIndex;
        delete nextProps.autosave;
        delete nextProps.updateVextabString;
        delete nextProps.notationId;
        delete nextProps.setEnabled;
        delete nextProps.enabled;
        delete nextProps.notifyUpdated;

        return nextProps;
      })
    );

    return enhance(BaseComponent);
  }
);

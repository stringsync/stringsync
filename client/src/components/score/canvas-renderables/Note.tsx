import * as React from 'react';
import { compose, withHandlers, withState, withProps } from 'recompose';
import { Maestro } from 'services';
import { observeMaestro } from 'enhancers';
import { Note as NoteModel, Chord as ChordModel } from 'models/music';

type Renderable = NoteModel | ChordModel;

interface IActiveObjProps {
  activeObj: Renderable | null;
  setActiveObj: (activeObj: Renderable | null) => void;
}

interface IActivationProps extends IActiveObjProps {
  activate: (nextObj: Renderable) => void;
  deactivate: () => void;
}

interface IInnerProps extends IActivationProps {
  handleNotification: (maestro: Maestro) => void;
}

const enhance = compose(
  withState('activeObj', 'setActiveObj', null),
  withProps((props: IActiveObjProps) => ({
    activate: (nextObj: Renderable ): void => {
      if (props.activeObj !== nextObj) {
        if (props.activeObj) {
          props.activeObj.renderer.deactivate();
        }

        nextObj.renderer.activate();
        props.setActiveObj(nextObj);
      }
    },
    deactivate: (): void => {
      if (props.activeObj) {
        props.activeObj.renderer.deactivate();
        props.setActiveObj(null);
      }
    }
  })),
  withHandlers({
    handleNotification: (props: IActivationProps) => (maestro: Maestro) => {
      const { note } = maestro.state;
      
      if (!note || !note.isHydrated) {
        props.deactivate();
        return;
      }

      if (note.type === 'NOTE' || note.type === 'CHORD') {
        props.activate(note);
      }
    }
  }),
  observeMaestro<IInnerProps>(
    props => ({ name: 'NoteController', handleNotification: props.handleNotification })
  )
);

export const Note = enhance(() => null);

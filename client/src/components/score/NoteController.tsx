import * as React from 'react';
import { compose, withHandlers, withState, withProps } from 'recompose';
import { Maestro } from 'services';
import { observeMaestro } from 'enhancers';
import { isEqual } from 'lodash';
import { Note, Chord } from 'models/music';

interface IActiveObjProps {
  activeObj: Chord | Note | null;
  setActiveObj: (activeObj: Chord | Note | null) => void;
}

interface IActivationProps extends IActiveObjProps {
  activate: (nextObj: Chord | Note) => void;
  deactivate: () => void;
}

interface IInnerProps extends IActivationProps {
  handleNotification: (maestro: Maestro) => void;
}

const enhance = compose(
  withState('activeObj', 'setActiveObj', null),
  withProps((props: IActiveObjProps) => ({
    activate: (nextObj: Chord | Note ): void => {
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

export const NoteController = enhance(() => null);

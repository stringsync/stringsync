import * as React from 'react';
import { Fretboard } from '../../models/fretboard';
import { Maestro } from '../../models/maestro';
import { compose, withHandlers } from 'recompose';
import { get } from 'lodash';
import { Note } from '../../models/score/line/measure/note';
import { subscribeMaestro } from '../../enhancers/subscribeMaestro';

interface IProps {
  fretboard: Fretboard;
}

interface IHandlerProps {
  updateFretMarkers: (maestro: Maestro) => void;
}

type InnerProps = IProps & IHandlerProps;

const enhance = compose<InnerProps, IProps>(
  withHandlers<IProps, IHandlerProps>({
    updateFretMarkers: props => maestro => {
      const note = get(maestro.currentSpec, 'note') as Note | undefined;

      if (!note) {
        return;
      }

      props.fretboard.updateFretMarkers(note);
    }
  }),
  subscribeMaestro<InnerProps>(props => ({
    name: 'updateFretMarkers',
    callback: props.updateFretMarkers
  }))
);

export const Lighter = enhance(() => null);

import * as React from 'react';
import { Fretboard } from '../../models/fretboard';
import { Maestro } from '../../models/maestro';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { IStore } from '../../@types/store';
import { get } from 'lodash';
import { Note } from '../../models/score/line/measure/note';
import { subscribeMaestro } from '../../enhancers/subscribeMaestro';

interface IStateProps {
  fretboard: Fretboard | null;
}

interface IHandlerProps {
  updateFretMarkers: (maestro: Maestro) => void;
}

type InnerProps = IStateProps & IHandlerProps;

const enhance = compose<InnerProps, {}>(
  connect<IStateProps, {}, {}, IStore>(
    state => ({
      fretboard: state.score.fretboard
    })
  ),
  withHandlers<IStateProps, IHandlerProps>({
    updateFretMarkers: props => maestro => {
      const note = get(maestro, 'currentSpec.note');

      if (!note || !props.fretboard) {
        return;
      }

      props.fretboard.updateFretMarkers(note as Note);
    }
  }),
  subscribeMaestro<InnerProps>(props => ({
    name: 'updateFretMarkers',
    callback: props.updateFretMarkers
  }))
);

export const Lighter = enhance(() => null);

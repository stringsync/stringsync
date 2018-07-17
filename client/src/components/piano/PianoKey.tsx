import * as React from 'react';
import { compose, withState, lifecycle, branch, renderComponent } from 'recompose';
import { BlackPianoKey, WhitePianoKey } from './';
import { Note } from 'models';
import { PianoKeyStates, PianoKey as PianoKeyModel } from 'models/piano';
import { get } from 'lodash';

interface IOuterProps {
  note: string;
}

interface IInnerProps extends IOuterProps {
  keyState: PianoKeyStates;
  setKeyState: (keyState: PianoKeyStates) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withState('keyState', 'setKeyState', 'HIDDEN'),
  lifecycle<IInnerProps, {}>({
    componentDidMount(): void {
      const { maestro } = window.ss;

      if (!maestro) {
        throw new Error('expected Maestro instance to be defined on window.ss');
      }

      const { piano } = maestro;

      if (!piano) {
        throw new Error('expected Fretboard to be defined on maestro');
      }

      piano.add(new PianoKeyModel(this, this.props.note));
    },
    componentWillUnmount(): void {
      const fretboard = get(window.ss.maestro, 'piano');

      if (!fretboard) {
        return;
      }

      fretboard.remove(this.props.note);
    }
  }),
  branch(
    (props: IInnerProps) => Note.from(props.note).toSharp().isSharp,
    renderComponent((props: IInnerProps) => <BlackPianoKey note={props.note} />),
    renderComponent((props: IInnerProps) => <WhitePianoKey note={props.note} />)
  )
);

export const PianoKey = enhance(() => null);

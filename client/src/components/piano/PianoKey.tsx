import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { BlackPianoKey, WhitePianoKey } from './';

interface IProps {
  note: string;
}

const enhance = compose<IProps, IProps>(
  branch(
    (props: IProps) => props.note.includes('#'),
    renderComponent((props: IProps) => <BlackPianoKey note={props.note} />),
    renderComponent((props: IProps) => <WhitePianoKey note={props.note} />)
  )
);

export const PianoKey = enhance(() => null);

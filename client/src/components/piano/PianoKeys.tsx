import * as React from 'react';
import { PianoKey } from './';
import styled from 'react-emotion';
import { Scale, Note } from 'models';
import { compose, withProps } from 'recompose';
import { range } from 'lodash';
import { Rhythm } from 'models';

interface IInnerProps {
  notes: string[];
}

const enhance = compose<IInnerProps, {}>(
  withProps(() => {
    const A0 = new Note('A', 0);
    const C8 = new Note('C', 8);

    const notes = Scale.for('C', 'chromatic')
        .notes(range(9))
        .filter(note => note.compare(A0) >= 0 && note.compare(C8) <= 0)
        .map(note => note.toString());

    return { notes };
  })
);

const Outer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  color: white;

  ::-webkit-scrollbar { 
    display: none; 
  }
`;

export const PianoKeys = enhance(props => (
  <Outer>
    {props.notes.map(note => <PianoKey key={`piano-key-${note}`} note={note} />)}
  </Outer>
));

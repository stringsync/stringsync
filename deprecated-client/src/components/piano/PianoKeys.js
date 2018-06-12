import React from 'react';
import { PianoKey } from './';
import styled from 'react-emotion';
import { Scale, Note } from 'models';
import { compose, withProps } from 'recompose';
import { range } from 'lodash';
import { Rhythm } from '../../models/music/rhythm';

const enhance = compose(
  withProps(props => {
    const A0 = new Note('A', 0);
    const C8 = new Note('C', 8);

    let notes = Scale.for('C', 'chromatic').notes(range(9)).filter(note => (
      note.compare(A0) >= 0 && note.compare(C8) <= 0
    ));

    notes = notes.map(note => note.toString());

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
`;

const PianoKeys = enhance(props => (
  <Outer>
    {props.notes.map(note => <PianoKey key={`piano-key-${note}`} note={note} />)}
  </Outer>
));

export default PianoKeys;
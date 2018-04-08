import React from 'react';
import { compose } from 'recompose';
import styled from 'react-emotion';

const enhance = compose(

);

const Outer = styled('div')`
  background-color: black;
`;

const Fretboard = enhance(() => (
  <Outer>
    <div>
      Fretboard
    </div>
  </Outer>
));

export default Fretboard;

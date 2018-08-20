import * as React from 'react';
import styled from 'react-emotion';
import { Video } from 'components';

const Outer = styled('div')`
  background: black;
  overflow: hidden;
  
  iframe {
    width: 100%;
  }
`;

export const EditVideo = () => (
  <Outer>
    <Video />
  </Outer>
);

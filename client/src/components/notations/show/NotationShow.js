import React from 'react';
import { Affix } from 'antd';
import styled from 'react-emotion';

const Outer = styled('div')`
  display: flex;
  flex-flow: column;
  overflow: hidden;
  width: 100%;
`;

const Top = styled('div')`
`;

const Middle = styled('div')`
`;

const Bottom = styled('div')`
`;


const NotationShow = props => (
  <Outer id="notation-show">
    <Top>
      NotationShowVideo
      <Affix
        target={() => document.getElementById('notation-show')}
        offsetTop={2}
      >
        Fretboard
        Piano
      </Affix>
    </Top>
    <Middle>
      ScrollElement
      Score
    </Middle>
    <Bottom>
      NotationControls
    </Bottom>
  </Outer>
);

export default NotationShow;

import { Slider } from 'antd';
import React from 'react';
import styled from 'styled-components';

const Outer = styled.div`
  padding: 0 12px;
`;

export const VolumeSlider = () => {
  return (
    <Outer>
      <Slider handleStyle={{ width: 21, height: 21, marginTop: -8 }} />
    </Outer>
  );
};

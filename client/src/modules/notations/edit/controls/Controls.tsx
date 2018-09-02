import * as React from 'react';
import { Selector } from './selector';
import styled from 'react-emotion';
import { Divider, Form } from 'antd';
import { Primary } from './Primary';
import { Selected } from './Selected';
import { TimeEditors } from './TimeEditors';
import { VextabStringEditor } from './VextabStringEditor';

const Outer = styled('div')`
  padding: 12px 16px;
`;

export const Controls: React.SFC = () => (
  <Outer>
    <Divider orientation="left">MAIN</Divider>
    <Form layout="inline">
      <Primary />
      <TimeEditors />
      <Selector />
      <VextabStringEditor />
    </Form>
    <Divider />
    <Selected />
  </Outer>
);

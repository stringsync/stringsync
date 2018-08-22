import * as React from 'react';
import { Selector } from './Selector';
import styled from 'react-emotion';
import { Divider, Form } from 'antd';
import { Enabler } from './Enabler';
import { Selected } from './Selected';

const Outer = styled('div')`
  padding: 12px 16px;
`;

export const Controls: React.SFC = () => (
  <Outer>
    <Divider>options</Divider>
    <Form>
      <Enabler />
    </Form>
    <Divider />
    <Form layout="inline">
      <Selector />
    </Form>
    <Divider />
    <Selected />
  </Outer>
);

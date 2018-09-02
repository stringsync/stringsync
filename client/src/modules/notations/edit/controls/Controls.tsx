import * as React from 'react';
import { Selector } from './selector';
import styled from 'react-emotion';
import { Divider, Form, Collapse } from 'antd';
import { Primary } from './Primary';
import { Selected } from './Selected';
import { TimeEditors } from './TimeEditors';
import { VextabStringEditor } from './VextabStringEditor';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';

const Outer = styled('div')`
  padding: 12px 16px;
`;

export const Controls: React.SFC = () => (
  <Outer>
    <Divider orientation="left">MAIN</Divider>
    <Form layout="inline">
      <Collapse bordered={false}>
        <Collapse.Panel key="1" header="new">
          <Primary />
          <TimeEditors />
          <Selector />
        </Collapse.Panel>
        <CollapsePanel key="2" header="old">
          <VextabStringEditor />
        </CollapsePanel>
      </Collapse>
    </Form>
    <Divider />
    <Selected />
  </Outer>
);

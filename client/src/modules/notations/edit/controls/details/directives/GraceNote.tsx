import * as React from 'react';
import { compose, withProps } from 'recompose';
import { Form, Input, Checkbox } from 'antd';
import { Directive } from 'models';
import styled from 'react-emotion';
import { Position } from './Position';

interface IOuterProps {
  directive: Directive;
  directiveIndex: number;
}

const enhance = compose<IOuterProps, IOuterProps>(
  
);

const Indented = styled('div')`
  margin-left: 16px;
`;

export const GraceNote = enhance(props => (
  <Form.Item label="grace note">
    <Indented>
      <Form.Item label="slur">
        <Checkbox checked={props.directive.payload.slur} />
      </Form.Item>
      <Form.Item label="duration">
        <Input defaultValue={props.directive.payload.duration} />
      </Form.Item>
      <Position
        position={props.directive.payload.positions[0]}
        directive={props.directive}
        directiveIndex={props.directiveIndex}
      />
    </Indented>
  </Form.Item>
));

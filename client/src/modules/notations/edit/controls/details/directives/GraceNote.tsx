import * as React from 'react';
import { compose, withProps } from 'recompose';
import { Form, Input, Checkbox, Button } from 'antd';
import { Directive } from 'models';
import styled from 'react-emotion';
import { Position } from './Position';
import { withEditorHandlers } from 'enhancers';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

type Events = CheckboxChangeEvent | React.FormEvent<HTMLInputElement> | number | string;

interface IOuterProps {
  directive: Directive;
  directiveIndex: number;
}

interface IWithEditorHandlers extends IOuterProps {
  handleSlurChange: (event: CheckboxChangeEvent) => void;
  handleDurationChange: (event: React.FormEvent<HTMLInputElement>) => void;
  removeGraceNote: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const enhance = compose<IWithEditorHandlers, IOuterProps>(
  withEditorHandlers<Events, IOuterProps>({
    handleDurationChange: props => (event: React.FormEvent<HTMLInputElement>, editor) => {
      const nextPayload = { ...props.directive.payload, ...{ duration: event.currentTarget.value } };
      editor.updateGraceNote(props.directiveIndex, nextPayload);
    },
    handleSlurChange: props => (event: CheckboxChangeEvent, editor) => {
      const nextPayload = { ...props.directive.payload, ...{ slur: event.target.checked } };
      editor.updateGraceNote(props.directiveIndex, nextPayload);
    },
    removeGraceNote: props => (_, editor) => {
      editor.removeDirective(props.directiveIndex);
    }
  })
);

const Indented = styled('div')`
  margin-left: 16px;
`;

export const GraceNote = enhance(props => (
  <Form.Item label="grace note">
    <Indented>
      <Form.Item label="slur">
        <Checkbox
          onChange={props.handleSlurChange}
          checked={props.directive.payload.slur}
        />
      </Form.Item>
      <Form.Item label="duration">
        <Input
          onChange={props.handleDurationChange}
          defaultValue={props.directive.payload.duration}
        />
      </Form.Item>
      <Position
        position={props.directive.payload.positions[0]}
        directive={props.directive}
        directiveIndex={props.directiveIndex}
      />
    </Indented>
    <Button onClick={props.removeGraceNote}>
      remove
    </Button>
  </Form.Item>
));

import * as React from 'react';
import { compose, renderComponent } from 'recompose';
import { Directive as DirectiveModel } from 'models';
import { cond } from 'enhancers';
import { Form, Alert } from 'antd';
import { GraceNote } from './GraceNote';
import { NoteSuggestions } from './NoteSuggestions';

interface IOuterProps {
  directive: DirectiveModel;
  directiveIndex: number;
}

const enhance = compose<IOuterProps, IOuterProps>(
  cond<IOuterProps>([
    [({ directive }) => directive.type === 'GRACE_NOTE', renderComponent(GraceNote)],
    // uncomment when ready to work on NOTE_SUGGESTIONS
    // [({ directive }) => directive.type === 'NOTE_SUGGESTIONS', renderComponent(NoteSuggestions)]
  ])
);

export const Directive = enhance(() => (
  <Form.Item>
    <Alert message="no element found" /> 
  </Form.Item>
));

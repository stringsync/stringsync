import * as React from 'react';
import { compose, withProps } from 'recompose';
import { Measure, VextabElement, Directive as DirectiveModel } from 'models';
import { Form, Button } from 'antd';
import { Directive } from './Directive';
import { get } from 'lodash';
import { withEditorHandlers } from 'enhancers';

interface IOuterProps {
  element: Measure | VextabElement | null;
}

interface IDirectivesProps extends IOuterProps {
  directives: DirectiveModel[];
}

interface IWithEditorProps extends IDirectivesProps {
  addDirective: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const enhance = compose<IWithEditorProps, IOuterProps>(
  withProps((props: IOuterProps) => ({
    directives: get(props.element, 'directives', [])
  })),
  withEditorHandlers<React.SyntheticEvent<HTMLButtonElement>, IDirectivesProps>({
    addDirective: () => (_, editor) => {
      editor.addDirective();
    }
  })
);

export const Directives = enhance(props => (
  <Form.Item>
    <Form.Item>
      <Button
        disabled={!props.element}
        onClick={props.addDirective}
      >
        add
      </Button>
    </Form.Item>
    {
      props.directives.map((directive, ndx) => (
        <Directive key={`directive-${ndx}`} directive={directive} directiveIndex={ndx} />
      ))
    }
  </Form.Item>
));

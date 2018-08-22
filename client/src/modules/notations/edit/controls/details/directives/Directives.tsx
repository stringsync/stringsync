import * as React from 'react';
import { compose, withProps } from 'recompose';
import { Measure, MeasureElement, Directive as DirectiveModel } from 'models';
import { Form } from 'antd';
import { Directive } from './Directive';
import { get } from 'lodash';

interface IOuterProps {
  element: Measure | MeasureElement | null;
}

interface IDirectivesProps extends IOuterProps {
  directives: DirectiveModel[];
}

const enhance = compose<IDirectivesProps, IOuterProps>(
  withProps((props: IOuterProps) => ({
    directives: get(props.element, 'directives', [])
  }))
);

export const Directives = enhance(props => (
  <Form.Item>
    {
      props.directives.map((directive, ndx) => (
        <Directive key={`directive-${ndx}`} directive={directive} />
      ))
    }
  </Form.Item>
));

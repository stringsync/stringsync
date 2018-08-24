import * as React from 'react';
import { compose, branch, renderNothing, withProps } from 'recompose';
import { Form, Input } from 'antd';
import { Measure, MeasureElement, Annotations as AnnotationsModel } from 'models';
import { get } from 'lodash';

interface IOuterProps {
  element: Measure | MeasureElement | null;
}

interface ITextProps extends IOuterProps {
  texts: string[];
}

const enhance = compose<ITextProps, IOuterProps>(
  branch<IOuterProps>(props => !props.element, renderNothing),
  withProps((props: IOuterProps) => {
    const texts: string[] = [];

    const annotations: AnnotationsModel[] = get(props.element, 'annotations', []);
    
    annotations.forEach((annotation: AnnotationsModel) => {
      annotation.texts.forEach(text => texts.push(text))
    });

    return { texts };
  })
);  

export const Annotations = enhance(props => (
  <Form.Item>
    {
      props.texts.map((text, ndx) => (
        <Form.Item key={`annotations-${ndx}`} label="annotation">
          <Input value={text} />
        </Form.Item>
      ))
    }
  </Form.Item>
));

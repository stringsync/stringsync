import * as React from 'react';
import { Form } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import { RemoveElement } from './RemoveElement';
import { compose, withState, withHandlers } from 'recompose';
import { Measure, MeasureElement } from 'models';
import { AddElement } from './AddElement';
import { RadioChangeEvent } from 'antd/lib/radio';

export type ElementTypes = 'MEASURE' | 'NOTE' | 'REST';

interface IOuterProps {
  measure: Measure | null;
  element: MeasureElement | null;
  elementIndex: number;
  barElementIndex: number;
}

interface IStateProps extends IOuterProps {
  elementType: ElementTypes;
  setElementType: (elementType: ElementTypes) => void;
}

interface IHandlerProps extends IStateProps {
  handleElementTypeChange: (event: RadioChangeEvent) => void;
}

const enhance = compose<IHandlerProps, IOuterProps>(
  withState('elementType', 'setElementType', 'MEASURE'),
  withHandlers({
    handleElementTypeChange: (props: IStateProps) => (event: RadioChangeEvent) => {
      props.setElementType(event.target.value);
    }
  })
);

export const ElementManager = enhance(props => (
  <Form.Item>
    <div>
      <Form.Item>
        <ButtonGroup>
          <AddElement
            type="primary"
            elementIndex={props.elementIndex}
            elementType="MEASURE"
          >
            measure
          </AddElement>
          <AddElement
            type="primary"
            elementIndex={props.elementIndex}
            elementType="NOTE"
          >
            note
          </AddElement>
        </ButtonGroup>
      </Form.Item>
    </div>
    <div>
      <Form.Item>
        <ButtonGroup>
          <RemoveElement
            disabled={!props.measure}
            elementIndex={props.barElementIndex}
          >
            measure
          </RemoveElement>
          <RemoveElement
            disabled={!props.element || props.element.type === 'BAR'}
            elementIndex={props.elementIndex}
          >
            note
          </RemoveElement>
        </ButtonGroup>
      </Form.Item>
    </div>
  </Form.Item>
));

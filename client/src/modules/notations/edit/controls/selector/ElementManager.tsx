import * as React from 'react';
import { Form } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import { RemoveElement } from './RemoveElement';
import { compose, withState, withHandlers } from 'recompose';
import { Measure, VextabElement, Bar } from 'models';
import { AddElement } from './AddElement';
import { RadioChangeEvent } from 'antd/lib/radio';
import { ElementType } from './ElementType';

export type ElementTypes = 'MEASURE' | 'NOTE' | 'REST';

interface IOuterProps {
  measure: Measure | null;
  element: VextabElement | null;
  elementIndex: number;
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
    <Form.Item>
      <ButtonGroup>
        <RemoveElement
          disabled={!props.measure}
          elementIndex={props.elementIndex}
          elementType="MEASURE"
        >
          measure
          </RemoveElement>
        <RemoveElement
          disabled={!props.element}
          elementIndex={props.elementIndex}
          elementType="ELEMENT"
        >
          note
          </RemoveElement>
      </ButtonGroup>
    </Form.Item>
    <Form.Item label="type">
      <ElementType element={props.element} />
    </Form.Item>
  </Form.Item>
));

import * as React from 'react';
import { compose, withHandlers, lifecycle, withProps } from 'recompose';
import { Dispatch, connect } from 'react-redux';
import { EditorActions } from 'data';
import { InputNumber, Form } from 'antd';
import { Measure, VextabElement } from 'models';
import { get } from 'lodash';
import { ElementManager } from './ElementManager';

/**
 * Takes the value from an InputNumber component and returns a number or null.
 * 
 * @param value 
 */
const parseValue = (value: number | string | void): number => {
  if (typeof value === 'number') {
    return value;
  } else if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? -1 : parsed;
  } else {
    return -1;
  }
}

interface IConnectProps {
  editor: Store.IEditorState;
  setElementIndex: (index: number | null) => void;
}

interface ISelectedProps extends IConnectProps {
  measure: Measure | null;
  element: VextabElement | null;
}

interface IHandlerProps extends ISelectedProps {
  handleElementIndexChange: (value: number) => void;
  handleMeasureIndexChange: (value: number) => void;
}

const enhance = compose<IHandlerProps, {}>(
  connect(
    (state: Store.IState) => ({
      editor: state.editor
    }),
    (dispatch: Dispatch) => ({
      setElementIndex: (index: number) => dispatch(EditorActions.setElementIndex(index)),
    })
  ),
  withProps((props: IConnectProps) => {
    const { vextab } = props.editor;
    const element = vextab ? vextab.elements[props.editor.elementIndex] || null : null;
    const measure = element ? element.measure : null;

    return { element, measure };
  }),
  lifecycle<ISelectedProps, {}>({
    componentDidUpdate(prevProps): void {
      if (!this.props.editor.enabled && prevProps.editor.enabled) {
        this.props.setElementIndex(-1);
      } else if (this.props.editor.enabled && !prevProps.editor.enabled) {
        this.props.setElementIndex(0);
      }
    }
  }),
  withHandlers({
    handleElementIndexChange: (props: IConnectProps) => (elementIndex: number) => {
      const { vextab } = window.ss.maestro;

      if (!vextab) {
        return;
      }

      props.setElementIndex(elementIndex);
    },
    handleMeasureIndexChange: (props: IConnectProps) => (measureIndex: number) => {
      const { vextab } = window.ss.maestro;

      if (!vextab) {
        return;
      }

      // get the index of the first element in the measure
      const measure = vextab.measures[measureIndex];

      if (!measure) {
        return;
      }

      const element = measure.elements[0];
      const elementIndex = vextab.elements.indexOf(element);

      props.setElementIndex(elementIndex);
    }
  })
);

export const Selector = enhance(props => (
  <Form.Item>
    <Form.Item label="element">
      <InputNumber
        min={-1}
        max={get(props.editor.vextab, 'elements.length', 1) - 1}
        disabled={!props.editor.enabled}
        value={props.editor.elementIndex as number | undefined}
        onChange={props.handleElementIndexChange}
        parser={parseValue}
      />
    </Form.Item>
    <Form.Item label="measure">
      <InputNumber
        min={-1}
        max={get(props.editor.vextab, 'measures.length', 1) - 1}
        disabled={!props.editor.enabled}
        value={get(props.measure, 'index')}
        onChange={props.handleMeasureIndexChange}
        parser={parseValue}
      />
    </Form.Item>
    <ElementManager
      element={props.element}
      measure={props.measure}
      elementIndex={props.editor.elementIndex}
    />
  </Form.Item>
));

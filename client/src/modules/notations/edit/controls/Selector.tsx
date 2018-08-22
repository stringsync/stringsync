import * as React from 'react';
import { compose, withHandlers, lifecycle, withProps } from 'recompose';
import { Dispatch, connect } from 'react-redux';
import { EditorActions } from 'data';
import { InputNumber, Form, Divider } from 'antd';
import { Measure, MeasureElement } from 'models';
import { get } from 'lodash';

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
  element: MeasureElement | null;
}

interface IHandlerProps extends ISelectedProps {
  handleElementIndexChange: (value: number | string) => void;
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
    const { vextab } = window.ss.maestro;
    const element = vextab ? vextab.elements[props.editor.elementIndex] || null : null;
    const measure = element ? element.measure : null;

    return { element, measure };
  }),
  lifecycle<ISelectedProps, {}>({
    componentDidMount(): void {
      this.props.setElementIndex(0);
    }
  }),
  withHandlers({
    handleElementIndexChange: (props: IConnectProps) => (elementIndex: number) => {
      const { vextab } = window.ss.maestro;

      if (!vextab) {
        return;
      }

      props.setElementIndex(elementIndex);
    }
  })
);

export const Selector = enhance(props => (
  <Form layout="inline">
    <Divider>Selector</Divider>
    <Form.Item
      colon={false}
      label="element"
    >
      <InputNumber
        min={-1}
        value={props.editor.elementIndex as number | undefined}
        onChange={props.handleElementIndexChange}
        parser={parseValue}
      />
    </Form.Item>
    <Form.Item
      colon={false}
      label="measure"
    >
      <InputNumber
        disabled={true}
        value={get(props.measure, 'id')}
      />
    </Form.Item>
  </Form>
));

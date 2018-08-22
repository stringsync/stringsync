import * as React from 'react';
import { compose, withProps, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { MeasureElement, Measure } from 'models';
import { Form, Divider } from 'antd';
import { get } from 'lodash';
import { Details } from './details';
import { NotFound } from './details/NotFound';

interface IConnectProps {
  editor: Store.IEditorState;
}

interface ISelectedProps extends IConnectProps {
  measure: Measure | null;
  element: MeasureElement | null;
}

const enhance = compose<ISelectedProps, {}>(
  connect(
    (state: Store.IState) => ({
      editor: state.editor
    })
  ),
  withProps((props: IConnectProps) => {
    let measure: Measure | null = null;
    let element: MeasureElement | null = null;

    const { vextab } = window.ss.maestro;

    if (vextab) {
      element = vextab.elements[props.editor.elementIndex] || null;
    }

    if (element) {
      measure = element.measure || null;
    }

    return { measure, element };
  }),
  branch((props: ISelectedProps) => !props.element, renderComponent(NotFound))
);

export const Selected = enhance(props => (
  <Form.Item>
    <Form.Item
      colon={false}
      label={get(props.measure, 'type', 'NONE')}
    >
      <Details element={props.measure} />
    </Form.Item>
    <Divider />
    <Form.Item
      colon={false}
      label={get(props.element, 'type', 'NONE')}
    >
      <Details element={props.element} />
    </Form.Item>
    <Divider />
    <Form.Item
      colon={false}
      label="ANNOTATIONS"
    >
      <Details show="annotations" element={props.element}/>
    </Form.Item>
    <Divider />
    <Form.Item
      colon={false}
      label="DIRECTIVES"
    >
      <Details show="directives" element={props.element} />
    </Form.Item>
  </Form.Item>
));

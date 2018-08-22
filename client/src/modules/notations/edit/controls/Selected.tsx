import * as React from 'react';
import { compose, withProps, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { MeasureElement, Measure } from 'models';
import { Form, Divider, Collapse } from 'antd';
import { get } from 'lodash';
import { Details } from './details';
import { NotFound } from './details/NotFound';

const { Panel } = Collapse;

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
    <Collapse accordion={true} bordered={false}>
      <Panel key="1" header="MEASURE">
        <Form layout="inline">
          <Details element={props.measure} />
        </Form>
      </Panel>
      <Panel key="2" header={get(props.element, 'type')}>
        <Form layout="inline">
          <Details element={props.element} />
        </Form>
      </Panel>
      <Panel key="3" header="ANNOTATIONS">
        <Form layout="inline">
          <Details show="annotations" element={props.element} />
        </Form>
      </Panel>
      <Panel key="4" header="DIRECTIVES">
        <Form layout="inline">
          <Details show="directives" element={props.element} />
        </Form>
      </Panel>
    </Collapse>
  </Form.Item>
));

import * as React from 'react';
import { compose, withProps, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { MeasureElement, Measure, Vextab } from 'models';
import { Form, Collapse } from 'antd';
import { get } from 'lodash';
import { Details } from './details';
import { NotFound } from './details/NotFound';

const { Panel } = Collapse;

interface IConnectProps {
  editor: Store.IEditorState;
  vextabString: string;
}

interface ISelectedProps extends IConnectProps {
  measure: Measure | null;
  element: MeasureElement | null;
}

const enhance = compose<ISelectedProps, {}>(
  connect(
    (state: Store.IState) => ({
      editor: state.editor,
      vextabString: state.notation.vextabString
    })
  ),
  withProps((props: IConnectProps) => {
    if (!props.vextabString) {
      return;
    }

    let measure: Measure | null = null;
    let element: MeasureElement | null = null;

    const vextab = new Vextab(Vextab.decode(props.vextabString), 1);

    element = vextab.elements[props.editor.elementIndex] || null;

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
        <Details editor={props.editor} element={props.measure} />
      </Panel>
      <Panel key="2" header={get(props.element, 'type')}>
        <Details editor={props.editor}  element={props.element} />
      </Panel>
      <Panel key="3" header="ANNOTATIONS">
        <Details editor={props.editor}  show="annotations" element={props.element} />
      </Panel>
      <Panel key="4" header="DIRECTIVES">
        <Details editor={props.editor}  show="directives" element={props.element} />
      </Panel>
    </Collapse>
  </Form.Item>
));

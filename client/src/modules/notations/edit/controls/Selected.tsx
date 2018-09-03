import * as React from 'react';
import { compose, withProps, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { Measure, Vextab, VextabElement } from 'models';
import { Collapse } from 'antd';
import { get } from 'lodash';
import { Details } from './details';
import { NotFound } from './details/NotFound';

const { Panel } = Collapse;

interface IConnectProps {
  editor: Store.IEditorState;
  vextab: Vextab | null;
}

interface ISelectedProps extends IConnectProps {
  measure: Measure | null;
  element: VextabElement | null;
}

const enhance = compose<ISelectedProps, {}>(
  connect(
    (state: Store.IState) => ({
      editor: state.editor,
      vextab: state.maestro.vextab
    })
  ),
  withProps((props: IConnectProps) => {
    const { vextab } = props;

    if (!vextab) {
      return;
    }

    let measure: Measure | null = null;
    let element: VextabElement | null = null;

    element = vextab.elements[props.editor.elementIndex] || null;

    if (element) {
      measure = element.measure || null;
    }

    return { measure, element };
  }),
  branch((props: ISelectedProps) => !props.element, renderComponent(NotFound))
);

export const Selected = enhance(props => (
  <Collapse accordion={true} bordered={false}>
    <Panel key="1" header={get(props.element, 'type')}>
      <Details editor={props.editor} element={props.element} />
    </Panel>
    <Panel key="2" header="MEASURE">
      <Details editor={props.editor} element={props.measure} />
    </Panel>
    <Panel key="3" header="ANNOTATIONS">
      <Details editor={props.editor} show="annotations" element={props.element} />
    </Panel>
    <Panel key="4" header="DIRECTIVES">
      <Details editor={props.editor} show="directives" element={props.element} />
    </Panel>
  </Collapse>
));

import * as React from 'react';
import { compose } from 'recompose';
import { Form, Input, InputNumber } from 'antd';
import { withEditorHandlers } from 'enhancers';
import { Directive } from 'models';
import { connect } from 'react-redux';

interface IOuterProps {
  directive: Directive;
  directiveIndex: number;
  position: Guitar.IPosition;
}

interface IConnectProps extends IOuterProps {
  elementIndex: number;
}

interface IHandlerProps extends IConnectProps {
  handleFretChange: (fret: number | string) => void;
  handleStrChange: (str: number | string) => void;
}

const enhance = compose<IHandlerProps, IOuterProps>(
  connect(
    (state: Store.IState) => ({
      elementIndex: state.editor.elementIndex
    })
  ),
  withEditorHandlers<number | string, IConnectProps>({
    handleFretChange: props => (value, editor) => {
      let nextFret: number | undefined = typeof value === 'number' ? value : parseInt(value, 10);
      nextFret = isNaN(nextFret) ? undefined : nextFret;

      const directive = editor.vextab.elements[props.elementIndex].directives[props.directiveIndex];

      if (!directive) {
        return;
      }

      directive.payload.positions[0].fret = nextFret;
    },
    handleStrChange: props => (value, editor) => {
      let nextStr: number | undefined = typeof value === 'number' ? value : parseInt(value, 10);
      nextStr = isNaN(nextStr) ? undefined : nextStr;

      const directive = editor.vextab.elements[props.elementIndex].directives[props.directiveIndex];

      if (!directive) {
        return;
      }

      directive.payload.positions[0].str = nextStr;
    }
  })
);

export const Position = enhance(props => (
  <Form.Item>
    <Input.Group compact={true}>
      <InputNumber
        min={1}
        max={6}
        defaultValue={props.position.str}
        onChange={props.handleStrChange}
      />
      <InputNumber
        min={0}
        max={30}
        defaultValue={props.position.fret}
        onChange={props.handleFretChange}
      />
    </Input.Group>
  </Form.Item>
));

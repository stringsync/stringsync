import * as React from 'react';
import { compose } from 'recompose';
import { Form, Input, InputNumber } from 'antd';
import { withVextabChangeHandlers } from 'enhancers';
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
}

const enhance = compose<IHandlerProps, IOuterProps>(
  connect(
    (state: Store.IState) => ({
      elementIndex: state.editor.elementIndex
    })
  ),
  withVextabChangeHandlers<number | string, IConnectProps>({
    handleFretChange: props => (value, vextab) => {
      let nextFret: number | undefined = typeof value === 'number' ? value : parseInt(value, 10);
      nextFret = isNaN(nextFret) ? undefined : nextFret;

      const directive = vextab.elements[props.elementIndex].directives[props.directiveIndex];
      
      if (!directive) {
        return;
      }

      directive.payload.positions[0].fret = nextFret;
      
      return vextab;
    }
  })
);

export const Position = enhance(props => (
  <Form.Item>
    <Input.Group compact={true}>
      <InputNumber disabled={true} value={props.position.str} />
      <InputNumber
        min={0}
        max={30}
        defaultValue={props.position.fret}
        onChange={props.handleFretChange}
      />
    </Input.Group>
  </Form.Item>
));

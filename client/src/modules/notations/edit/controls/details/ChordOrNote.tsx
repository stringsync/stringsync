import * as React from 'react';
import { compose, withProps } from 'recompose';
import { Form, Input, Radio } from 'antd';
import { Note as NoteModel, Chord as ChordModel, Rest } from 'models';
import { Rhythm } from './Rhythm';
import { Position } from './Position';
import { withEditorHandlers } from 'enhancers';
import { RadioChangeEvent } from 'antd/lib/radio';

interface IOuterProps {
  element: NoteModel | ChordModel;
  editor: Store.IEditorState;
}

interface IFretsByStringsProps extends IOuterProps {
  fretsByStrings: {
    [key: number]: number;
  }
}

interface IWithEditorHandlerProps extends IFretsByStringsProps {
  handleArticulationChange: (event: RadioChangeEvent) => void;
  handleDecoratorChange: (event: RadioChangeEvent) => void;
}

const enhance = compose<IWithEditorHandlerProps, IOuterProps>(
  withProps((props: IOuterProps) => ({
    fretsByStrings: props.element.positions.reduce((memo, pos) => {
      memo[pos.str] = pos.fret;
      return memo
    }, {})
  })),
  withEditorHandlers<RadioChangeEvent, IFretsByStringsProps>({
    handleArticulationChange: () => (event, editor) => {
      const element = editor.removeElement();

      if (!element || element instanceof Rest) {
        return;
      }

      element.articulation = event.target.value || '';
      editor.addElement(element);
    },
    handleDecoratorChange: () => (event, editor) => {
      const element = editor.removeElement();

      if (!element || element instanceof Rest) {
        return;
      }

      element.decorator = event.target.value || '';
      editor.addElement(element);
    }
  })
);

export const ChordOrNote = enhance(props => (
  <div>
    <Rhythm editor={props.editor} element={props.element.rhythm} />
    <Form>
      <Form.Item>
        <Radio.Group
          onChange={props.handleArticulationChange}
          defaultValue={props.element.articulation || undefined}
        >
          <Radio.Button value={'b'}>b</Radio.Button>
          <Radio.Button value={'s'}>s</Radio.Button>
          <Radio.Button value={'h'}>h</Radio.Button>
          <Radio.Button value={'p'}>p</Radio.Button>
          <Radio.Button value={'t'}>t</Radio.Button>
          <Radio.Button value={'T'}>T</Radio.Button>
          <Radio.Button value={undefined}>none</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item>
        <Radio.Group
          onChange={props.handleDecoratorChange}
          defaultValue={props.element.decorator || undefined}
        >
          <Radio.Button value={'v'}>v</Radio.Button>
          <Radio.Button value={'V'}>V</Radio.Button>
          <Radio.Button value={'u'}>u</Radio.Button>
          <Radio.Button value={'d'}>d</Radio.Button>
          <Radio.Button value={undefined}>none</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="positions (string, fret)">
        {
          [1, 2, 3, 4, 5, 6].map(str => (
            <Position
              key={`note-${props.editor.elementIndex}-${str}`}
              element={props.element}
              editor={props.editor}
              position={{ str, fret: props.fretsByStrings[str] }}
            />
          ))
        }
      </Form.Item>
    </Form>
  </div>
));

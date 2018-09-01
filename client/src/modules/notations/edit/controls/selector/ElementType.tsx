import * as React from 'react';
import { compose, withProps } from 'recompose';
import { Rhythm, Note, Rest, VextabElement } from 'models';
import { Radio } from 'antd';
import RadioGroup from 'antd/lib/radio/group';
import { connect } from 'react-redux';
import { RadioChangeEvent } from 'antd/lib/radio';
import { withEditorHandlers } from 'enhancers';
import { get } from 'lodash';
import { Editor } from 'models/vextab/Editor';

type ElementTypes = 'NOTE' | 'REST' | 'BAR' | null;

interface IOuterProps {
  element: VextabElement | null;
}

interface IConnectProps extends IOuterProps {
  editor: Store.IEditorState;
}

interface ITypeProps extends IConnectProps {
  type: ElementTypes;
}

interface IWithVextabChangeHandlerProps extends ITypeProps {
  castType: (event: RadioChangeEvent) => void;
}

const enhance = compose<IWithVextabChangeHandlerProps, IOuterProps>(
  connect(
    (state: Store.IState) => ({
      editor: state.editor
    })
  ),
  withProps((props: IConnectProps) => {
    let type: ElementTypes = null;

    if (props.element) {
      type = props.element.type === 'CHORD' ? 'NOTE' : props.element.type;
    }
    
    return { type };
  }),
  withEditorHandlers<RadioChangeEvent, IWithVextabChangeHandlerProps>({
    castType: props => (event: RadioChangeEvent, editor) => {
      const element = editor.vextab.elements[props.editor.elementIndex];
      const rhythm: Rhythm = get(element, 'rhythm', new Rhythm('4', false));

      if (!element.measure) {
        return;
      }
      
      let nextElement: Rest | Note;
      switch (event.target.value) {
        case 'NOTE':
          const note = Editor.getDefaultNote();
          note.rhythm = rhythm;
          nextElement = note;
          break;

        case 'REST':
          const rest = new Rest(0, rhythm);
          nextElement = rest;
          break;

        default:
          return;
      }

      editor.removeElement();
      editor.addElement(nextElement);
    }
  })
);

export const ElementType = enhance(props => ((
  <RadioGroup
    disabled={!props.element}
    onChange={props.castType}
    value={props.type}
  >
    <Radio value="NOTE">NOTE</Radio>
    <Radio value="REST">REST</Radio>
  </RadioGroup>
)));

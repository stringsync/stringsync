import * as React from 'react';
import { compose, mapProps } from 'recompose';
import { withEditorHandlers } from 'enhancers';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { Bar, Rest, Rhythm, Measure, Note, TimeSignature, Key, VextabElement } from 'models';
import { ElementTypes } from './ElementManager';
import { connect, Dispatch } from 'react-redux';
import { EditorActions } from 'data';
import { get } from 'lodash';

interface IOuterProps {
  elementType: ElementTypes;
  elementIndex: number;
}

interface IConnectProps extends IOuterProps {
  setElementIndex: (elementIndex: number) => void;
}

interface IHandlerProps extends IConnectProps {
  handleButtonClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

interface IMappedProps {
  onClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const newNote = () => new Note('C', 4, { positions: [{ str: 2, fret: 1 }] });

const newRest = () => {
  const rhythm = new Rhythm('4', false);
  return new Rest(0, rhythm);
}

const newBar = () => {
  const note = newNote();
  const key = new Key(note);
  const timeSignature = new TimeSignature(4, 4);
  return new Bar('single', key, timeSignature);
}

const newMeasure = (bar: Bar) => {
  const nextBar = bar.clone();
  const rest = newRest();
  return new Measure(nextBar, [rest]);
}

const enhance = compose<IMappedProps & ButtonProps, IOuterProps & ButtonProps>(
  connect(
    null,
    (dispatch: Dispatch) => ({
      setElementIndex: (elementIndex: number) => dispatch(EditorActions.setElementIndex(elementIndex))
    })
  ),
  withEditorHandlers<React.SyntheticEvent<HTMLButtonElement>, IConnectProps>({
    handleButtonClick: props => (_, editor) => {
      switch (props.elementType) {
        case 'MEASURE':
          const bar = get(editor.measure, 'bar', newBar());
          editor.addMeasure(newMeasure(bar));
          return;
        
        case 'NOTE':
          editor.addElement(newNote());
          return;

        case 'REST':
          editor.addElement(newRest());
          return;

        default:
          throw new Error(`unexpected elementType: ${props.elementType}`);
      }
    }
  }),
  mapProps((props: IHandlerProps & ButtonProps) => {
    const nextProps = Object.assign({}, props);

    nextProps.onClick = props.handleButtonClick;

    delete nextProps.handleButtonClick;
    delete nextProps.elementIndex;
    delete nextProps.elementType;
    delete nextProps.setElementIndex;

    return nextProps;
  })
)

export const AddElement = enhance(props => <Button {...props} />);

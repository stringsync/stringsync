import * as React from 'react';
import { compose, mapProps } from 'recompose';
import { withEditorHandlers } from 'enhancers';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { ElementTypes } from './ElementManager';
import { connect, Dispatch } from 'react-redux';
import { EditorActions } from 'data';
import { get } from 'lodash';
import { Editor } from 'models/vextab/Editor';

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
          const bar = get(editor.measure, 'bar', Editor.getDefaultBar());
          const measure = Editor.getDefaultMeasure(bar); 
          editor.addMeasure(measure);
          return;
        
        case 'NOTE':
          editor.addElement(Editor.getDefaultNote());
          return;

        case 'REST':
          editor.addElement(Editor.getDefaultRest());
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

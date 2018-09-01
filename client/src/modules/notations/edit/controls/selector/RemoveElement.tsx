import * as React from 'react';
import { compose, mapProps } from 'recompose';
import { withEditorHandlers } from 'enhancers';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';

interface IOuterProps {
  elementIndex: number;
  elementType: 'MEASURE' | 'ELEMENT';
}

interface IHandlerProps extends IOuterProps {
  handleButtonClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

interface IMappedProps {
  onClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const enhance = compose<IMappedProps & ButtonProps, IOuterProps & ButtonProps>(
  withEditorHandlers<React.SyntheticEvent<HTMLButtonElement>, IOuterProps>({
    handleButtonClick: props => (_, editor) => {
      switch (props.elementType) {
        case 'MEASURE':
          editor.removeMeasure();
          return;

        case 'ELEMENT':
          editor.removeElement();
          return;

        default:
          throw new Error(`unexpected elementType: ${props.elementType}`);
      }
    }
  }),
  mapProps((props: IHandlerProps & ButtonProps) => {
    const nextProps = Object.assign({}, props);

    delete nextProps.handleButtonClick;
    delete nextProps.elementIndex;
    delete nextProps.elementType;

    nextProps.onClick = props.handleButtonClick;

    return nextProps;
  })
)

export const RemoveElement = enhance(props => <Button {...props} />);

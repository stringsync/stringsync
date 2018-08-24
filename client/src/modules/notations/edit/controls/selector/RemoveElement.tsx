import * as React from 'react';
import { compose, mapProps } from 'recompose';
import { withVextabChangeHandlers } from 'enhancers';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { connect, Dispatch } from 'react-redux';
import { EditorActions } from 'data';

interface IOuterProps {
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
  withVextabChangeHandlers<React.SyntheticEvent<HTMLButtonElement>, IConnectProps>({
    handleButtonClick: props => (event, vextab) => {
      const element = vextab.elements[props.elementIndex];
      props.setElementIndex(props.elementIndex - 1);

      if (!element || !element.measure) {
        return;
      }

      element.measure.remove(element);
      
      return vextab;
    }
  }),
  mapProps((props: IHandlerProps & ButtonProps) => {
    const nextProps = Object.assign({}, props);

    nextProps.onClick = props.handleButtonClick;
    delete nextProps.handleButtonClick;
    delete nextProps.elementIndex;
    delete nextProps.setElementIndex;

    return nextProps;
  })
)

export const RemoveElement = enhance(props => <Button {...props} />);

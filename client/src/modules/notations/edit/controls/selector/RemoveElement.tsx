import * as React from 'react';
import { compose, mapProps } from 'recompose';
import { withVextabChangeHandlers } from 'enhancers';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { connect, Dispatch } from 'react-redux';
import { EditorActions } from 'data';
import { take } from 'lodash';

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

      if (!element || !element.measure) {
        return;
      }

      // get the measure that we'll focus before the removal
      //  
      // then reverse the array and drop the elements at and before the reversed index
      const reversedElements = take(vextab.elements, props.elementIndex).reverse();

      // find the first bar after
      const bar = reversedElements.find(el => el.type === 'BAR');

      // lastly, determine the forward index
      const prevBarNdx = bar ? vextab.elements.indexOf(bar) : -1;

      element.measure.remove(element);

      if (prevBarNdx > -1) {
        props.setElementIndex(prevBarNdx);
      }
      
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

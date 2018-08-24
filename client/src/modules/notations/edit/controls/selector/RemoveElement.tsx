import * as React from 'react';
import { compose, mapProps } from 'recompose';
import { withVextabChangeHandlers } from 'enhancers';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';

interface IOuterProps {
  elementIndex: number;
}

interface IHandlerProps extends IOuterProps {
  handleButtonClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

interface IMappedProps {
  onClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const enhance = compose<IMappedProps & ButtonProps, IOuterProps & ButtonProps>(
  withVextabChangeHandlers<React.SyntheticEvent<HTMLButtonElement>, IOuterProps>({
    handleButtonClick: (props: IOuterProps) => (event, vextab) => {
      const element = vextab.elements[props.elementIndex];

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

    return nextProps;
  })
)

export const RemoveElement = enhance(props => <Button {...props} />);

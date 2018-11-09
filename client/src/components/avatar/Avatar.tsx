import * as React from 'react';
import { Avatar as AntdAvatar } from 'antd';
import { compose, withProps, ComponentEnhancer } from 'recompose';

interface IOuterProps {
  src: string | null;
  name: string;
}

interface IInnerProps extends IOuterProps {
  initial: string;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withProps((props: IOuterProps) => ({
    initial: (props.name && props.name.length > 0) ? props.name[0].toUpperCase() : ''
  }))
);

export const Avatar = enhance(props => (
  props.src ? <AntdAvatar src={props.src} /> : <AntdAvatar>{props.initial}</AntdAvatar>
));

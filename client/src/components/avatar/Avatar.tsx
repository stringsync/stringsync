import * as React from 'react';
import { Avatar as AntdAvatar } from 'antd';
import { compose, withProps, ComponentEnhancer } from 'recompose';

interface IOuterProps {
  src: string | null;
  name: string;
}

interface IInnerProps extends IOuterProps {
  initials: string;
}

const enhance: ComponentEnhancer<IInnerProps, IOuterProps> = compose(
  withProps((props: IOuterProps) => {
    let initials = '';

    if (props.name && props.name.length > 0) {
      initials = props.name[0].toUpperCase();
    }

    return { initials }
  })
)

export const Avatar = enhance(props => (
  props.src ? <AntdAvatar src={props.src} /> : <AntdAvatar>{props.initials}</AntdAvatar>
));

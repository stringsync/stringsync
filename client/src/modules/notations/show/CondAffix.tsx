import * as React from 'react';
import { compose, branch, renderComponent, defaultProps } from 'recompose';
import { Affix as AntdAffix } from 'antd';

interface IProps {
  shouldAffix: () => boolean;
  affixProps?: any;
}

const Affix = props => <AntdAffix {...props.affixProps}>{props.children}</AntdAffix>;

const enhance = compose<IProps, IProps>(
  defaultProps({ affixProps: {} }),
  branch<IProps>(
    props => props.shouldAffix(),
    renderComponent(Affix)
  )
);

export const CondAffix = enhance(props => <div>{props.children}</div>);

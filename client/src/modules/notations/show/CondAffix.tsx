import * as React from 'react';
import { compose, branch, renderComponent, defaultProps } from 'recompose';
import withSizes from 'react-sizes';
import { Affix as AntdAffix } from 'antd';

interface IProps {
  shouldAffix: () => boolean;
  affixProps?: any;
}

interface IWithSizesProps {
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
}

type InnerProps = IProps & IWithSizesProps;

const Affix = props => <AntdAffix {...props.affixProps}>{props.children}</AntdAffix>;

const enhance = compose<InnerProps, IProps>(
  defaultProps({ affixProps: {} }),
  branch<InnerProps>(
    props => props.shouldAffix(),
    renderComponent(Affix)
  )
);

export const CondAffix = enhance(props => <>{props.children}</>);

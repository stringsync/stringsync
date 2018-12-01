import * as React from 'react';
import { compose, branch, renderComponent, defaultProps } from 'recompose';
import withSizes from 'react-sizes';
import { Affix as AntdAffix } from 'antd';

type ViewportType = 'desktop' | 'mobile' | 'tablet';

interface IProps {
  affixWhen: ViewportType[];
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
  withSizes(size => ({
    mobile: withSizes.isMobile(size),
    tablet: withSizes.isTablet(size),
    desktop: withSizes.isDesktop(size)
  })),
  branch<InnerProps>(
    props => props.affixWhen.some(viewportType => props[viewportType]),
    renderComponent(Affix)
  )
);

export const CondAffix = enhance(props => <>{props.children}</>);

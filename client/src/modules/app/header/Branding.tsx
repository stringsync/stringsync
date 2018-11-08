import * as React from 'react';
import { Brand, Logo } from '../../../components/branding';
import { compose, branch, renderComponent } from 'recompose';
import withSizes from 'react-sizes';

interface IInnerProps {
  isDesktop: boolean;
}

const enhance = compose<IInnerProps, {}>(
  withSizes(sizes => ({ isDesktop: withSizes.isDesktop(sizes) })),
  branch<IInnerProps>(
    props => props.isDesktop,
    renderComponent(Brand)
  )
);

export const Branding = enhance(() => <Logo width={24} height={24} />);

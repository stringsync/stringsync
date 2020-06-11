import React from 'react';
import { withLayout } from './withLayout';
import { Layouts } from './Layouts';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

const Foo: React.FC = () => <div>Foo</div>;

it('renders the none layout', () => {
  const withNoneLayout = withLayout(Layouts.NONE);
  const FooWithNoneLayout = withNoneLayout(Foo);

  const { TestComponent } = getTestComponent(FooWithNoneLayout, {});
  const { getByTestId } = render(<TestComponent />);

  expect(getByTestId('none-layout')).not.toBeNull();
});

it('renders the default layout', () => {
  const withDefaultLayout = withLayout(Layouts.DEFAULT);
  const FooWithDefaultLayout = withDefaultLayout(Foo);

  const { TestComponent } = getTestComponent(FooWithDefaultLayout, {});
  const { getByTestId } = render(<TestComponent />);

  expect(getByTestId('default-layout')).not.toBeNull();
});

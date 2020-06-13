import React from 'react';
import { withLayout } from './withLayout';
import { Layouts } from './types';
import { render } from '@testing-library/react';
import { Test } from '../../testing';

const Foo: React.FC = () => <div>Foo</div>;

it('renders the none layout', () => {
  const withNoneLayout = withLayout(Layouts.NONE);
  const FooWithNoneLayout = withNoneLayout(Foo);

  const { getByTestId } = render(
    <Test>
      <FooWithNoneLayout />
    </Test>
  );

  expect(getByTestId('none-layout')).not.toBeNull();
});

it('renders the default layout', () => {
  const withDefaultLayout = withLayout(Layouts.DEFAULT);
  const FooWithDefaultLayout = withDefaultLayout(Foo);

  const { getByTestId } = render(
    <Test>
      <FooWithDefaultLayout />
    </Test>
  );

  expect(getByTestId('default-layout')).not.toBeNull();
});

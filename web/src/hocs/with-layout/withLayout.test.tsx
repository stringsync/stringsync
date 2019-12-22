import React from 'react';
import { withLayout } from './withLayout';
import { Layouts } from './Layouts';
import { render } from '@testing-library/react';
import { createApolloClient } from '../../util';
import createStore from '../../store/createStore';
import Root from '../../modules/root/Root';

const Foo: React.FC = () => <div>Foo</div>;

it('renders the none layout', () => {
  const withNoneLayout = withLayout(Layouts.NONE);
  const FooWithNoneLayout = withNoneLayout(Foo);

  const apollo = createApolloClient();
  const store = createStore(apollo);

  const { getByTestId } = render(
    <Root store={store}>
      <FooWithNoneLayout />
    </Root>
  );

  expect(getByTestId('none-layout')).not.toBeNull();
});

it('renders the default layout', () => {
  const withDefaultLayout = withLayout(Layouts.DEFAULT);
  const FooWithDefaultLayout = withDefaultLayout(Foo);

  const apollo = createApolloClient();
  const store = createStore(apollo);

  const { getByTestId } = render(
    <Root store={store}>
      <FooWithDefaultLayout />
    </Root>
  );

  expect(getByTestId('default-layout')).not.toBeNull();
});

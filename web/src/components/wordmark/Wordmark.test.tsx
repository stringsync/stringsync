import React from 'react';
import { Wordmark } from './Wordmark';
import { render } from '@testing-library/react';
import Root from '../../modules/root/Root';
import { createApolloClient } from '../../util';
import createStore from '../../store/createStore';

it('renders without crashing', () => {
  const apollo = createApolloClient();
  const store = createStore(apollo);

  const { container } = render(
    <Root store={store}>
      <Wordmark />
    </Root>
  );

  expect(container).toBeInTheDocument();
});

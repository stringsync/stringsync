import React from 'react';
import Root from './Root';
import { render } from '@testing-library/react';
import { createApolloClient } from '../../util';
import { createStore } from '../../store';

it('renders without crashing', () => {
  const apollo = createApolloClient();
  const store = createStore(apollo);
  const { container } = render(<Root store={store} />);
  expect(container).toBeInTheDocument();
});

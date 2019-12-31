import React from 'react';
import Root from './Root';
import { render } from '@testing-library/react';
import { createApolloClient } from '../../util';
import { getStore } from '../../store';

it('renders without crashing', () => {
  const apollo = createApolloClient();
  const store = getStore(apollo);
  const { container } = render(<Root store={store} />);
  expect(container).toBeInTheDocument();
});

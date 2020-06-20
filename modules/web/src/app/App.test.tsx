import React from 'react';
import { render } from '@testing-library/react';
import { createStore } from '../store';
import { App } from './App';
import { createClients } from '../clients';

it('renders without crashing', () => {
  const store = createStore();
  const clients = createClients();
  const { container } = render(<App store={store} clients={clients} />);
  expect(container).toBeInTheDocument();
});

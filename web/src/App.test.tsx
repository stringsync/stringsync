import { render } from '@testing-library/react';
import React from 'react';
import { App } from './App';
import { createStore } from './store';

describe('App', () => {
  it('renders without crashing', () => {
    const store = createStore();
    const { container } = render(<App store={store} />);
    expect(container).toBeInTheDocument();
  });
});

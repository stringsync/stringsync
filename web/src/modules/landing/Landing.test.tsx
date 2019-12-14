import React from 'react';
import Landing from './Landing';
import createStore from '../../store/createStore';
import Root from '../root/Root';
import { render } from '@testing-library/react';
import App from '../app/App';

it('renders without crashing', () => {
  const store = createStore();
  const { container } = render(
    <Root store={store}>
      <App>
        <Landing />
      </App>
    </Root>
  );
  expect(container).toBeInTheDocument();
});

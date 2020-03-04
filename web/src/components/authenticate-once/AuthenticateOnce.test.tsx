import React from 'react';
import { AuthenticateOnce } from './AuthenticateOnce';
import { authenticate } from '../../store';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

jest.mock('../../store/modules/auth/authenticate', () => ({
  authenticate: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('dispatches a authentication action once', () => {
  const { TestComponent, store } = getTestComponent(AuthenticateOnce, {});

  const dispatchSpy = jest
    .spyOn(store, 'dispatch')
    .mockImplementation(jest.fn());

  const { rerender, container } = render(<TestComponent />);
  rerender(<TestComponent />);

  expect(container).toBeInTheDocument();
  expect(dispatchSpy).toBeCalledTimes(1);
  expect(authenticate).toBeCalledTimes(1);
});

import React from 'react';
import { AuthenticateOnce } from './AuthenticateOnce';
import { getReauthAction } from '../../store';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

jest.mock('../../store/modules/auth/getReauthAction', () => ({
  getReauthAction: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('dispatches a reauth action once', () => {
  const { TestComponent, store } = getTestComponent(AuthenticateOnce, {});

  const dispatchSpy = jest
    .spyOn(store, 'dispatch')
    .mockImplementation(jest.fn());

  const { rerender, container } = render(<TestComponent />);
  rerender(<TestComponent />);

  expect(container).toBeInTheDocument();
  expect(dispatchSpy).toBeCalledTimes(1);
  expect(getReauthAction).toBeCalledTimes(1);
});

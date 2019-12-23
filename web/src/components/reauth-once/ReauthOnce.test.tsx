import React from 'react';
import { ReauthOnce } from './ReauthOnce';
import { getReauthAction } from '../../store';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

jest.mock('../../store/modules/auth/getReauthAction', () => ({
  getReauthAction: jest.fn(),
}));

it('dispatches a reauth action', () => {
  const { TestComponent, store } = getTestComponent(ReauthOnce, {});

  const dispatchSpy = jest
    .spyOn(store, 'dispatch')
    .mockImplementationOnce(jest.fn());

  const { container } = render(<TestComponent />);

  expect(container).toBeInTheDocument();
  expect(dispatchSpy).toBeCalledTimes(1);
  expect(getReauthAction).toBeCalledTimes(1);
});

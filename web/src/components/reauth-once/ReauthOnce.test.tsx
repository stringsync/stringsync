import React from 'react';
import { ReauthOnce } from './ReauthOnce';
import { getReauthAction } from '../../store';
import Root from '../../modules/root/Root';
import { createApolloClient } from '../../util';
import createStore from '../../store/createStore';
import { render } from '@testing-library/react';

jest.mock('../../store/modules/auth/getReauthAction', () => ({
  getReauthAction: jest.fn(),
}));

it('dispatches a reauth action', () => {
  const apollo = createApolloClient();
  const store = createStore(apollo);
  const dispatchSpy = jest
    .spyOn(store, 'dispatch')
    .mockImplementationOnce(jest.fn());

  const { container } = render(
    <Root store={store}>
      <ReauthOnce />
    </Root>
  );

  expect(container).toBeInTheDocument();
  expect(dispatchSpy).toBeCalledTimes(1);
  expect(getReauthAction).toBeCalledTimes(1);
});

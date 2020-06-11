import React from 'react';
import { useClient } from './useClient';
import { Client, StringSyncClient } from '../client';
import { render } from '@testing-library/react';

it('exposes the client', () => {
  let client: StringSyncClient | undefined = undefined;
  const Component = () => {
    client = useClient();
    return null;
  };

  render(<Component />);

  expect(client).toBeInstanceOf(Client);
});

import React from 'react';
import { AuthSync } from './AuthSync';
import { Clients, createClients, UserRoles } from '../clients';
import { render, waitFor } from '@testing-library/react';
import { Test } from '../testing';
import { AppStore, createStore } from '../store';
import { UserRole } from '@stringsync/domain';

let store: AppStore;
let clients: Clients;

beforeEach(() => {
  store = createStore();
  clients = createClients();
});

it('updates auth user when successful', async () => {
  const now = new Date();
  const whoamiSpy = jest.spyOn(clients.authClient, 'whoami');
  whoamiSpy.mockResolvedValue({
    data: {
      whoami: {
        id: '1',
        createdAt: now.toJSON(),
        updatedAt: now.toJSON(),
        email: 'email@domain.tld',
        role: UserRoles.TEACHER,
        username: 'username',
        confirmedAt: now.toJSON(),
      },
    },
  });

  render(
    <Test store={store} clients={clients}>
      <AuthSync />
    </Test>
  );

  await waitFor(() => expect(whoamiSpy).toHaveBeenCalledTimes(1));

  expect(store.getState().auth.user).toStrictEqual({
    id: 1,
    email: 'email@domain.tld',
    username: 'username',
    role: UserRole.TEACHER,
    confirmedAt: now.toJSON(),
  });
});

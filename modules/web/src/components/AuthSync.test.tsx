import React from 'react';
import { AuthSync } from './AuthSync';
import { Clients, createClients, UserRoles } from '../clients';
import { render, waitFor, wait } from '@testing-library/react';
import { Test } from '../testing';
import { AppStore, createStore } from '../store';
import { UserRole } from '@stringsync/domain';
import { getNullAuthUser } from '../store/auth/getNullAuthUser';
import { GraphQLError } from 'graphql';

let store: AppStore;
let clients: Clients;

beforeEach(() => {
  store = createStore();
  clients = createClients();
});

it('updates auth user when logged in', async () => {
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

it('updates user when logged out', async () => {
  const whoamiSpy = jest.spyOn(clients.authClient, 'whoami');
  whoamiSpy.mockResolvedValue({ data: { whoami: null } });

  render(
    <Test store={store} clients={clients}>
      <AuthSync />
    </Test>
  );

  await waitFor(() => expect(whoamiSpy).toHaveBeenCalledTimes(1));

  expect(store.getState().auth.user).toStrictEqual(getNullAuthUser());
});

it('swallows errors silently', async () => {
  const whoamiSpy = jest.spyOn(clients.authClient, 'whoami');
  whoamiSpy.mockResolvedValue({ data: { whoami: null }, errors: [new GraphQLError('error message 1')] });

  render(
    <Test store={store} clients={clients}>
      <AuthSync />
    </Test>
  );

  await waitFor(() => expect(whoamiSpy).toHaveBeenCalledTimes(1));

  const state = store.getState();
  expect(state.auth.user).toStrictEqual(getNullAuthUser());
  expect(state.auth.errors).toHaveLength(0);
});

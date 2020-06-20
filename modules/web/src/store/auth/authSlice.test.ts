import { getNullAuthState } from './getNullAuthState';
import { AuthState } from './types';
import { authSlice, confirmEmail, clearAuth, clearAuthErrors } from './authSlice';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Clients, createClients } from '../../clients';
import { UserRole } from '@stringsync/domain';

let store: EnhancedStore<{ auth: AuthState }>;
let clients: Clients;

beforeEach(() => {
  clients = createClients();
  store = configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
  });
});

it('initializes state', () => {
  expect(store.getState().auth).toStrictEqual(getNullAuthState());
});

it('confirms emails', () => {
  const confirmedAt = new Date().toJSON();
  store.dispatch(confirmEmail({ confirmedAt }));
  expect(store.getState().auth.user.confirmedAt).toBe(confirmedAt);
});

it('clears auth', () => {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
    preloadedState: {
      auth: {
        errors: ['error1', 'error2', 'error3'],
        isPending: true,
        user: {
          id: 1,
          role: UserRole.TEACHER,
        },
      },
    },
  });

  store.dispatch(clearAuth());

  expect(store.getState().auth).toStrictEqual(getNullAuthState());
});

it('clears auth errors', () => {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
    preloadedState: {
      auth: {
        errors: ['error1', 'error2', 'error3'],
        isPending: true,
        user: {
          id: 1,
          username: 'foo',
          role: UserRole.TEACHER,
        },
      },
    },
  });

  store.dispatch(clearAuthErrors());

  const state = store.getState();
  expect(store.getState().auth.errors).toHaveLength(0);

  const { user } = state.auth;
  expect(user.id).toBe(1);
  expect(user.username).toBe('foo');
  expect(user.role).toBe(UserRole.TEACHER);
});

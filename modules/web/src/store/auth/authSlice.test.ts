import { getNullAuthUser } from './getNullAuthUser';
import { getNullAuthState } from './getNullAuthState';
import { authSlice, confirmEmail, clearAuth, clearAuthErrors, authenticate, login, signup, logout } from './authSlice';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Clients, createClients, UserRoles as TypegenUserRole } from '../../clients';
import { UserRole } from '@stringsync/domain';
import { GraphQLError } from 'graphql';

it('initializes state', () => {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
  });

  expect(store.getState().auth).toStrictEqual(getNullAuthState());
});

it('confirms emails', () => {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
  });

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
          id: '2g323gs',
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
          id: 'adsfsadf3',
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

describe('authenticate', () => {
  let clients: Clients;

  beforeEach(() => {
    clients = createClients();
  });

  it('pending', () => {
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      preloadedState: {
        auth: {
          errors: ['error1', 'error2', 'error3'],
          isPending: true,
          user: {
            id: 'df32f32fg',
            role: UserRole.TEACHER,
          },
        },
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [authenticate.name],
        },
      }),
    });

    store.dispatch(
      authenticate.pending('requestId', { authClient: clients.authClient, shouldClearAuthOnError: false })
    );

    const state = store.getState();
    expect(state.auth.isPending).toBe(true);
    expect(state.auth.errors).toHaveLength(0);
  });

  it('fulfilled', async () => {
    const now = new Date().toJSON();
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [authenticate.name],
        },
      }),
    });
    const whoamiSpy = jest.spyOn(clients.authClient, 'whoami');
    whoamiSpy.mockResolvedValue({
      data: {
        whoami: {
          id: '1',
          createdAt: now,
          updatedAt: now,
          email: 'email@domain.tld',
          role: TypegenUserRole.TEACHER,
          username: 'username',
        },
      },
    });

    await store.dispatch(authenticate({ authClient: clients.authClient, shouldClearAuthOnError: false }));

    const state = store.getState();
    expect(state.auth.errors).toHaveLength(0);
    expect(state.auth.isPending).toBe(false);
    expect(state.auth.user).toStrictEqual({
      id: 1,
      email: 'email@domain.tld',
      role: UserRole.TEACHER,
      username: 'username',
      confirmedAt: null,
    });
  });

  it('rejected with shouldClearAuthOnError', async () => {
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [authenticate.name],
        },
      }),
    });
    const whoamiSpy = jest.spyOn(clients.authClient, 'whoami');
    whoamiSpy.mockResolvedValue({ data: { whoami: null } });

    await store.dispatch(authenticate({ authClient: clients.authClient, shouldClearAuthOnError: true }));

    const state = store.getState();
    expect(state.auth.errors).toHaveLength(0);
    expect(state.auth.isPending).toBe(false);
    expect(state.auth.user).toStrictEqual(getNullAuthUser());
  });

  it('rejected without shouldClearAuthOnError and null response', async () => {
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [authenticate.name],
        },
      }),
    });
    const whoamiSpy = jest.spyOn(clients.authClient, 'whoami');
    whoamiSpy.mockResolvedValue({ data: { whoami: null } });

    await store.dispatch(authenticate({ authClient: clients.authClient, shouldClearAuthOnError: false }));

    const state = store.getState();
    expect(state.auth.isPending).toBe(false);
    expect(state.auth.errors).toHaveLength(1);
    expect(state.auth.errors).toStrictEqual(['not logged in']);
  });

  it('rejected without shouldClearAuthOnError and non null response', async () => {
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [authenticate.name],
        },
      }),
    });
    const whoamiSpy = jest.spyOn(clients.authClient, 'whoami');
    whoamiSpy.mockResolvedValue({
      data: { whoami: null },
      errors: [new GraphQLError('error1'), new GraphQLError('error2')],
    });

    await store.dispatch(authenticate({ authClient: clients.authClient, shouldClearAuthOnError: false }));

    const state = store.getState();
    expect(state.auth.isPending).toBe(false);
    expect(state.auth.errors).toHaveLength(2);
    expect(state.auth.errors).toStrictEqual(['error1', 'error2']);
  });

  it('rejected with thrown error', async () => {
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [authenticate.name],
        },
      }),
    });
    const whoamiSpy = jest.spyOn(clients.authClient, 'whoami');
    whoamiSpy.mockRejectedValue(new Error('error1'));

    await store.dispatch(authenticate({ authClient: clients.authClient, shouldClearAuthOnError: false }));

    const state = store.getState();
    expect(state.auth.isPending).toBe(false);
    expect(state.auth.errors).toHaveLength(1);
    expect(state.auth.errors).toStrictEqual(['error1']);
  });
});

describe('login', () => {
  let clients: Clients;

  beforeEach(() => {
    clients = createClients();
  });

  it('pending', () => {
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [login.name],
        },
      }),
    });

    store.dispatch(
      login.pending('requestId', {
        authClient: clients.authClient,
        input: { usernameOrEmail: 'email@domain.tld', password: 'password' },
      })
    );

    const state = store.getState();
    expect(state.auth.isPending).toBe(true);
    expect(state.auth.errors).toHaveLength(0);
  });

  it('fulfilled', async () => {
    const now = new Date().toJSON();
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [login.name],
        },
      }),
    });
    const loginSpy = jest.spyOn(clients.authClient, 'login');
    loginSpy.mockResolvedValue({
      data: {
        login: {
          id: '1',
          createdAt: now,
          updatedAt: now,
          email: 'email@domain.tld',
          username: 'username',
          role: TypegenUserRole.TEACHER,
        },
      },
    });

    await store.dispatch(
      login({ authClient: clients.authClient, input: { usernameOrEmail: 'email@domain.tld', password: 'password' } })
    );

    const state = store.getState();
    expect(state.auth.errors).toHaveLength(0);
    expect(state.auth.isPending).toBe(false);
    expect(state.auth.user).toStrictEqual({
      id: 1,
      email: 'email@domain.tld',
      role: UserRole.TEACHER,
      username: 'username',
      confirmedAt: null,
    });
  });

  it('rejected', async () => {
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [login.name],
        },
      }),
    });
    const loginSpy = jest.spyOn(clients.authClient, 'login');
    loginSpy.mockResolvedValue({ errors: [new GraphQLError('error1')] } as any);

    await store.dispatch(
      login({ authClient: clients.authClient, input: { usernameOrEmail: 'email@domain.tld', password: 'password' } })
    );

    const state = store.getState();
    expect(state.auth.errors).toStrictEqual(['error1']);
    expect(state.auth.isPending).toBe(false);
    expect(state.auth.user).toStrictEqual(getNullAuthUser());
  });

  it('rejected with thrown error', async () => {
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [login.name],
        },
      }),
    });
    const loginSpy = jest.spyOn(clients.authClient, 'login');
    loginSpy.mockRejectedValue(new Error('error1'));

    await store.dispatch(
      login({ authClient: clients.authClient, input: { usernameOrEmail: 'email@domain.tld', password: 'password' } })
    );

    const state = store.getState();
    expect(state.auth.errors).toStrictEqual(['error1']);
    expect(state.auth.isPending).toBe(false);
    expect(state.auth.user).toStrictEqual(getNullAuthUser());
  });
});

describe('signup', () => {
  let clients: Clients;

  beforeEach(() => {
    clients = createClients();
  });

  it('pending', () => {
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [signup.name],
        },
      }),
    });

    store.dispatch(
      signup.pending('requestId', {
        authClient: clients.authClient,
        input: { email: 'email@domain.tld', username: 'username', password: 'password' },
      })
    );

    const state = store.getState();
    expect(state.auth.isPending).toBe(true);
    expect(state.auth.errors).toHaveLength(0);
  });

  it('fulfilled', async () => {
    const now = new Date().toJSON();
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [signup.name],
        },
      }),
    });
    const loginSpy = jest.spyOn(clients.authClient, 'login');
    loginSpy.mockResolvedValue({
      data: {
        login: {
          id: '1',
          createdAt: now,
          updatedAt: now,
          email: 'email@domain.tld',
          username: 'username',
          role: TypegenUserRole.TEACHER,
        },
      },
    });

    await store.dispatch(
      login({ authClient: clients.authClient, input: { usernameOrEmail: 'email@domain.tld', password: 'password' } })
    );

    const state = store.getState();
    expect(state.auth.errors).toHaveLength(0);
    expect(state.auth.isPending).toBe(false);
    expect(state.auth.user).toStrictEqual({
      id: 1,
      email: 'email@domain.tld',
      role: UserRole.TEACHER,
      username: 'username',
      confirmedAt: null,
    });
  });

  it('rejected', async () => {
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [signup.name],
        },
      }),
    });
    const loginSpy = jest.spyOn(clients.authClient, 'login');
    loginSpy.mockResolvedValue({ errors: [new GraphQLError('error1')] } as any);

    await store.dispatch(
      login({ authClient: clients.authClient, input: { usernameOrEmail: 'email@domain.tld', password: 'password' } })
    );

    const state = store.getState();
    expect(state.auth.errors).toStrictEqual(['error1']);
    expect(state.auth.isPending).toBe(false);
    expect(state.auth.user).toStrictEqual(getNullAuthUser());
  });

  it('rejected with thrown error', async () => {
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [signup.name],
        },
      }),
    });
    const loginSpy = jest.spyOn(clients.authClient, 'login');
    loginSpy.mockRejectedValue(new Error('error1'));

    await store.dispatch(
      login({ authClient: clients.authClient, input: { usernameOrEmail: 'email@domain.tld', password: 'password' } })
    );

    const state = store.getState();
    expect(state.auth.errors).toStrictEqual(['error1']);
    expect(state.auth.isPending).toBe(false);
    expect(state.auth.user).toStrictEqual(getNullAuthUser());
  });
});

describe('logout', () => {
  let clients: Clients;

  beforeEach(() => {
    clients = createClients();
  });

  it('pending', () => {
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [logout.name],
        },
      }),
    });

    store.dispatch(logout.pending('requestId', { authClient: clients.authClient }));

    const state = store.getState();
    expect(state.auth.isPending).toBe(true);
    expect(state.auth.errors).toHaveLength(0);
  });

  it('fulfilled', async () => {
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [logout.name],
        },
      }),
    });
    const logoutSpy = jest.spyOn(clients.authClient, 'logout');
    logoutSpy.mockResolvedValue({ data: { logout: true } });

    await store.dispatch(logout({ authClient: clients.authClient }));

    const state = store.getState();
    expect(state.auth.errors).toHaveLength(0);
    expect(state.auth.isPending).toBe(false);
    expect(state.auth.user).toStrictEqual(getNullAuthUser());
  });

  it('rejected with thrown error', async () => {
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [logout.name],
        },
      }),
    });
    const logoutSpy = jest.spyOn(clients.authClient, 'logout');
    logoutSpy.mockRejectedValue(new Error('error1'));

    await store.dispatch(logout({ authClient: clients.authClient }));

    const state = store.getState();
    expect(state.auth.errors).toStrictEqual(['error1']);
    expect(state.auth.isPending).toBe(false);
  });
});

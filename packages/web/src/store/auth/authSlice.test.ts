import { configureStore } from '@reduxjs/toolkit';
import { UserRole } from '@stringsync/domain';
import { GraphQLError } from 'graphql';
import { AuthClient, UserRoles as TypegenUserRole } from '../../clients';
import {
  authenticate,
  authSlice,
  clearAuth,
  clearAuthErrors,
  confirmEmail,
  login,
  logout,
  sendResetPasswordEmail,
  signup,
} from './authSlice';
import { getNullAuthState } from './getNullAuthState';
import { getNullAuthUser } from './getNullAuthUser';

let authClient: AuthClient;

beforeEach(() => {
  authClient = AuthClient.create();
  jest.spyOn(AuthClient, 'create').mockReturnValue(authClient);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('authSlice', () => {
  it('fails on purpose', () => {
    throw new Error('will this be a message');
  });

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
    expect(user.id).toBe('adsfsadf3');
    expect(user.username).toBe('foo');
    expect(user.role).toBe(UserRole.TEACHER);
  });

  describe('authenticate', () => {
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
      });

      store.dispatch(authenticate.pending('requestId', { shouldClearAuthOnError: false }));

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
      });
      const whoamiSpy = jest.spyOn(authClient, 'whoami');
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

      await store.dispatch(authenticate({ shouldClearAuthOnError: false }));

      const state = store.getState();
      expect(state.auth.errors).toHaveLength(0);
      expect(state.auth.isPending).toBe(false);
      expect(state.auth.user).toStrictEqual({
        id: '1',
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
      });
      const whoamiSpy = jest.spyOn(authClient, 'whoami');
      whoamiSpy.mockResolvedValue({ data: { whoami: null } });

      await store.dispatch(authenticate({ shouldClearAuthOnError: true }));

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
      });
      const whoamiSpy = jest.spyOn(authClient, 'whoami');
      whoamiSpy.mockResolvedValue({ data: { whoami: null } });

      await store.dispatch(authenticate({ shouldClearAuthOnError: false }));

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
      });
      const whoamiSpy = jest.spyOn(authClient, 'whoami');
      whoamiSpy.mockResolvedValue({
        data: { whoami: null },
        errors: [new GraphQLError('error1'), new GraphQLError('error2')],
      });

      await store.dispatch(authenticate({ shouldClearAuthOnError: false }));

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
      });
      const whoamiSpy = jest.spyOn(authClient, 'whoami');
      whoamiSpy.mockRejectedValue(new Error('error1'));

      await store.dispatch(authenticate({ shouldClearAuthOnError: false }));

      const state = store.getState();
      expect(state.auth.isPending).toBe(false);
      expect(state.auth.errors).toHaveLength(1);
      expect(state.auth.errors).toStrictEqual(['error1']);
    });
  });

  describe('login', () => {
    it('pending', () => {
      const store = configureStore({
        reducer: {
          auth: authSlice.reducer,
        },
      });

      store.dispatch(
        login.pending('requestId', {
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
      });
      const loginSpy = jest.spyOn(authClient, 'login');
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

      await store.dispatch(login({ input: { usernameOrEmail: 'email@domain.tld', password: 'password' } }));

      const state = store.getState();
      expect(state.auth.errors).toHaveLength(0);
      expect(state.auth.isPending).toBe(false);
      expect(state.auth.user).toStrictEqual({
        id: '1',
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
      });
      const loginSpy = jest.spyOn(authClient, 'login');
      loginSpy.mockResolvedValue({ errors: [new GraphQLError('error1')] } as any);

      await store.dispatch(login({ input: { usernameOrEmail: 'email@domain.tld', password: 'password' } }));

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
      });
      const authClient = AuthClient.create();
      jest.spyOn(AuthClient, 'create').mockReturnValue(authClient);
      const loginSpy = jest.spyOn(authClient, 'login');
      loginSpy.mockRejectedValue(new Error('error1'));

      await store.dispatch(login({ input: { usernameOrEmail: 'email@domain.tld', password: 'password' } }));

      const state = store.getState();
      expect(state.auth.errors).toStrictEqual(['error1']);
      expect(state.auth.isPending).toBe(false);
      expect(state.auth.user).toStrictEqual(getNullAuthUser());
    });
  });

  describe('signup', () => {
    it('pending', () => {
      const store = configureStore({
        reducer: {
          auth: authSlice.reducer,
        },
      });

      store.dispatch(
        signup.pending('requestId', {
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
      });
      const authClient = AuthClient.create();
      jest.spyOn(AuthClient, 'create').mockReturnValue(authClient);
      const loginSpy = jest.spyOn(authClient, 'login');
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

      await store.dispatch(login({ input: { usernameOrEmail: 'email@domain.tld', password: 'password' } }));

      const state = store.getState();
      expect(state.auth.errors).toHaveLength(0);
      expect(state.auth.isPending).toBe(false);
      expect(state.auth.user).toStrictEqual({
        id: '1',
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
      });
      const authClient = AuthClient.create();
      jest.spyOn(AuthClient, 'create').mockReturnValue(authClient);
      const loginSpy = jest.spyOn(authClient, 'login');
      loginSpy.mockResolvedValue({ errors: [new GraphQLError('error1')] } as any);

      await store.dispatch(login({ input: { usernameOrEmail: 'email@domain.tld', password: 'password' } }));

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
      });
      const authClient = AuthClient.create();
      jest.spyOn(AuthClient, 'create').mockReturnValue(authClient);
      const loginSpy = jest.spyOn(authClient, 'login');
      loginSpy.mockRejectedValue(new Error('error1'));

      await store.dispatch(login({ input: { usernameOrEmail: 'email@domain.tld', password: 'password' } }));

      const state = store.getState();
      expect(state.auth.errors).toStrictEqual(['error1']);
      expect(state.auth.isPending).toBe(false);
      expect(state.auth.user).toStrictEqual(getNullAuthUser());
    });
  });

  describe('logout', () => {
    it('pending', () => {
      const store = configureStore({
        reducer: {
          auth: authSlice.reducer,
        },
      });

      store.dispatch(logout.pending('requestId'));

      const state = store.getState();
      expect(state.auth.isPending).toBe(true);
      expect(state.auth.errors).toHaveLength(0);
    });

    it('fulfilled', async () => {
      const store = configureStore({
        reducer: {
          auth: authSlice.reducer,
        },
      });
      const logoutSpy = jest.spyOn(authClient, 'logout');
      logoutSpy.mockResolvedValue({ data: { logout: true } });

      await store.dispatch(logout());

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
      });
      const logoutSpy = jest.spyOn(authClient, 'logout');
      logoutSpy.mockRejectedValue(new Error('error1'));

      await store.dispatch(logout());

      const state = store.getState();
      expect(state.auth.errors).toStrictEqual(['error1']);
      expect(state.auth.isPending).toBe(false);
    });
  });

  describe('sendResetPasswordEmail', () => {
    it('pending', () => {
      const store = configureStore({
        reducer: {
          auth: authSlice.reducer,
        },
      });

      store.dispatch(
        sendResetPasswordEmail.pending('requestId', {
          input: { email: 'email@domain.tld' },
        })
      );

      const state = store.getState();
      expect(state.auth.isPending).toBe(true);
      expect(state.auth.errors).toHaveLength(0);
    });

    it('fulfilled', async () => {
      const store = configureStore({
        reducer: {
          auth: authSlice.reducer,
        },
      });
      const logoutSpy = jest.spyOn(authClient, 'sendResetPasswordEmail');
      logoutSpy.mockResolvedValue({ data: { sendResetPasswordEmail: true } });

      await store.dispatch(sendResetPasswordEmail({ input: { email: 'email@domain.tld' } }));

      const state = store.getState();
      expect(state.auth.errors).toHaveLength(0);
      expect(state.auth.isPending).toBe(false);
    });

    it('rejected with thrown error', async () => {
      const store = configureStore({
        reducer: {
          auth: authSlice.reducer,
        },
      });
      const authClient = AuthClient.create();
      jest.spyOn(AuthClient, 'create').mockReturnValue(authClient);
      const sendResetPasswordEmailSpy = jest.spyOn(authClient, 'sendResetPasswordEmail');
      sendResetPasswordEmailSpy.mockRejectedValue(new Error('error1'));

      await store.dispatch(sendResetPasswordEmail({ input: { email: 'email@domain.tld' } }));

      const state = store.getState();
      expect(state.auth.errors).toStrictEqual(['error1']);
      expect(state.auth.isPending).toBe(false);
    });
  });
});

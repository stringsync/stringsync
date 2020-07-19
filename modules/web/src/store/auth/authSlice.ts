import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthUser, AuthState, AuthReducers } from './types';
import { getNullAuthUser } from './getNullAuthUser';
import { AuthClient, LoginInput, SignupInput, SendResetPasswordEmailInput } from '../../clients';
import { toAuthUser } from './toAuthUser';
import { RootState } from '../types';
import { getNullAuthState } from './getNullAuthState';

type AuthenticateReturned = { user: AuthUser };
type AuthenticateThunkArg = { authClient: AuthClient; shouldClearAuthOnError: boolean };
type AuthenticateThunkConfig = { state: RootState; rejectValue: { errors: string[] } };
export const authenticate = createAsyncThunk<AuthenticateReturned, AuthenticateThunkArg, AuthenticateThunkConfig>(
  'auth/authenticate',
  async (args, thunk) => {
    const { data, errors } = await args.authClient.whoami();

    const hasError = errors || !data.whoami;

    if (hasError && args.shouldClearAuthOnError) {
      thunk.dispatch(clearAuth());
      return { user: thunk.getState().auth.user };
    }
    if (errors) {
      return thunk.rejectWithValue({ errors: errors.map((error) => error.message) });
    }
    if (!data.whoami) {
      return thunk.rejectWithValue({ errors: ['not logged in'] });
    }
    return { user: toAuthUser(data.whoami) };
  }
);

type LoginReturned = { user: AuthUser };
type LoginThunkArg = { authClient: AuthClient; input: LoginInput };
type LoginThunkConfig = { rejectValue: { errors: string[] } };
export const login = createAsyncThunk<LoginReturned, LoginThunkArg, LoginThunkConfig>(
  'auth/login',
  async (args, thunk) => {
    const { data, errors } = await args.authClient.login(args.input);
    if (errors) {
      return thunk.rejectWithValue({ errors: errors.map((error) => error.message) });
    }
    return { user: toAuthUser(data.login) };
  }
);

type SignupReturned = { user: AuthUser };
type SignupThunkArg = { authClient: AuthClient; input: SignupInput };
type SignupThunkConfig = { rejectValue: { errors: string[] } };
export const signup = createAsyncThunk<SignupReturned, SignupThunkArg, SignupThunkConfig>(
  'auth/signup',
  async (args, thunk) => {
    const { data, errors } = await args.authClient.signup(args.input);
    if (errors) {
      return thunk.rejectWithValue({ errors: errors.map((error) => error.message) });
    }
    return { user: toAuthUser(data.signup) };
  }
);

type LogoutReturned = boolean;
type LogoutThunkArg = { authClient: AuthClient };
type LogoutThunkConfig = { rejectValue: { errors: string[] } };
export const logout = createAsyncThunk<LogoutReturned, LogoutThunkArg, LogoutThunkConfig>(
  'auth/logout',
  async (args, thunk) => {
    const { data, errors } = await args.authClient.logout();
    if (errors) {
      return thunk.rejectWithValue({ errors: errors.map((error) => error.message) });
    }
    return data.logout;
  }
);

type SendResetPasswordEmailReturned = boolean;
type SendResetPasswordEmailThunkArg = { authClient: AuthClient; input: SendResetPasswordEmailInput };
type SendResetPasswordEmailConfig = { rejectValue: { errors: string[] } };
export const sendResetPasswordEmail = createAsyncThunk<
  SendResetPasswordEmailReturned,
  SendResetPasswordEmailThunkArg,
  SendResetPasswordEmailConfig
>('auth/sendResetPasswordEmail', async (args, thunk) => {
  const { data, errors } = await args.authClient.sendResetPasswordEmail(args.input);
  if (errors) {
    return thunk.rejectWithValue({ errors: errors.map((error) => error.message) });
  }
  return data.sendResetPasswordEmail;
});

export const authSlice = createSlice<AuthState, AuthReducers>({
  name: 'auth',
  initialState: getNullAuthState(),
  reducers: {
    confirmEmail(state, action) {
      state.user.confirmedAt = action.payload.confirmedAt;
    },
    clearAuth() {
      return getNullAuthState();
    },
    clearAuthErrors(state) {
      state.errors = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authenticate.pending, (state) => {
      state.isPending = true;
      state.errors = [];
    });
    builder.addCase(authenticate.fulfilled, (state, action) => {
      state.isPending = false;
      state.user = action.payload.user;
    });
    builder.addCase(authenticate.rejected, (state, action) => {
      state.isPending = false;
      if (action.payload) {
        state.errors = action.payload.errors;
      } else if (action.error.message) {
        state.errors = [action.error.message];
      } else {
        state.errors = ['unknown error'];
      }
    });

    builder.addCase(login.pending, (state) => {
      state.isPending = true;
      state.errors = [];
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isPending = false;
      state.user = action.payload.user;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isPending = false;
      if (action.payload) {
        state.errors = action.payload.errors;
      } else if (action.error.message) {
        state.errors = [action.error.message];
      } else {
        state.errors = ['unknown error'];
      }
    });

    builder.addCase(logout.pending, (state) => {
      state.isPending = true;
      state.errors = [];
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isPending = false;
      state.user = getNullAuthUser();
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isPending = false;
      if (action.error.message) {
        state.errors = [action.error.message];
      } else {
        state.errors = ['unknown error'];
      }
    });

    builder.addCase(signup.pending, (state) => {
      state.isPending = true;
      state.errors = [];
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.isPending = false;
      state.user = action.payload.user;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.isPending = false;
      if (action.payload) {
        state.errors = action.payload.errors;
      } else if (action.error.message) {
        state.errors = [action.error.message];
      } else {
        state.errors = ['unknown error'];
      }
    });

    builder.addCase(sendResetPasswordEmail.pending, (state) => {
      state.isPending = true;
      state.errors = [];
    });
    builder.addCase(sendResetPasswordEmail.fulfilled, (state, action) => {
      state.isPending = false;
    });
    builder.addCase(sendResetPasswordEmail.rejected, (state, action) => {
      state.isPending = false;
      if (action.error.message) {
        state.errors = [action.error.message];
      } else {
        state.errors = ['unknown error'];
      }
    });
  },
});

export const { confirmEmail, clearAuth, clearAuthErrors } = authSlice.actions;

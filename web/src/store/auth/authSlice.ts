import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UNKNOWN_ERROR_MSG } from '../../errors';
import { $queries, LoginInput, SendResetPasswordEmailInput, SignupInput } from '../../graphql';
import { RootState } from '../types';
import { getNullAuthState } from './getNullAuthState';
import { getNullAuthUser } from './getNullAuthUser';
import { toAuthUser } from './toAuthUser';
import { AuthReducers, AuthState, AuthUser } from './types';

export type AuthenticateReturned = { user: AuthUser };
export type AuthenticateThunkArg = { shouldClearAuthOnError: boolean };
export type AuthenticateThunkConfig = { rejectValue: { errors: string[] } };
export const authenticate = createAsyncThunk<AuthenticateReturned, AuthenticateThunkArg, AuthenticateThunkConfig>(
  'auth/authenticate',
  async (args, thunk) => {
    const { data, errors } = await $queries.whoami();

    const hasError = !!errors || !data || !data.whoami;

    if (hasError && args.shouldClearAuthOnError) {
      thunk.dispatch(clearAuth());
      const state = thunk.getState() as RootState;
      return { user: state.auth.user };
    }
    if (errors) {
      return thunk.rejectWithValue({ errors: errors.map((error) => error.message) });
    }
    if (!data || !data.whoami) {
      return thunk.rejectWithValue({ errors: ['not logged in'] });
    }
    return { user: toAuthUser(data.whoami) };
  }
);

type LoginReturned = { user: AuthUser };
type LoginThunkArg = { input: LoginInput };
type LoginThunkConfig = { rejectValue: { errors: string[] } };
export const login = createAsyncThunk<LoginReturned, LoginThunkArg, LoginThunkConfig>(
  'auth/login',
  async (args, thunk) => {
    const { data, errors } = await $queries.login(args.input);
    if (errors) {
      return thunk.rejectWithValue({ errors: errors.map((error) => error.message) });
    }
    if (!data || !data.login) {
      return thunk.rejectWithValue({ errors: [UNKNOWN_ERROR_MSG] });
    }
    return { user: toAuthUser(data.login) };
  }
);

type SignupReturned = { user: AuthUser };
type SignupThunkArg = { input: SignupInput };
type SignupThunkConfig = { rejectValue: { errors: string[] } };
export const signup = createAsyncThunk<SignupReturned, SignupThunkArg, SignupThunkConfig>(
  'auth/signup',
  async (args, thunk) => {
    const { data, errors } = await $queries.signup(args.input);
    if (errors) {
      return thunk.rejectWithValue({ errors: errors.map((error) => error.message) });
    }
    if (!data) {
      return thunk.rejectWithValue({ errors: [UNKNOWN_ERROR_MSG] });
    }
    if (!data.signup) {
      return thunk.rejectWithValue({ errors: [UNKNOWN_ERROR_MSG] });
    }
    return { user: toAuthUser(data.signup) };
  }
);

type LogoutReturned = boolean;
type LogoutThunkArg = void;
type LogoutThunkConfig = { rejectValue: { errors: string[] } };
export const logout = createAsyncThunk<LogoutReturned, LogoutThunkArg, LogoutThunkConfig>(
  'auth/logout',
  async (_, thunk) => {
    const { data, errors } = await $queries.logout();
    if (errors) {
      return thunk.rejectWithValue({ errors: errors.map((error) => error.message) });
    }
    if (!data) {
      return thunk.rejectWithValue({ errors: [UNKNOWN_ERROR_MSG] });
    }
    if (!data.logout) {
      return thunk.rejectWithValue({ errors: [UNKNOWN_ERROR_MSG] });
    }
    return data.logout;
  }
);

type SendResetPasswordEmailReturned = boolean;
type SendResetPasswordEmailThunkArg = { input: SendResetPasswordEmailInput };
type SendResetPasswordEmailConfig = { rejectValue: { errors: string[] } };
export const sendResetPasswordEmail = createAsyncThunk<
  SendResetPasswordEmailReturned,
  SendResetPasswordEmailThunkArg,
  SendResetPasswordEmailConfig
>('auth/sendResetPasswordEmail', async (args, thunk) => {
  const { data, errors } = await $queries.sendResetPasswordEmail(args.input);
  if (errors) {
    return thunk.rejectWithValue({ errors: errors.map((error) => error.message) });
  }
  if (!data) {
    return thunk.rejectWithValue({ errors: [UNKNOWN_ERROR_MSG] });
  }
  if (!data.sendResetPasswordEmail) {
    return thunk.rejectWithValue({ errors: [UNKNOWN_ERROR_MSG] });
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
        state.errors = [UNKNOWN_ERROR_MSG];
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
        state.errors = [UNKNOWN_ERROR_MSG];
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
        state.errors = [UNKNOWN_ERROR_MSG];
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
        state.errors = [UNKNOWN_ERROR_MSG];
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
      if (action.payload) {
        state.errors = action.payload.errors;
      } else if (action.error.message) {
        state.errors = [action.error.message];
      } else {
        state.errors = [UNKNOWN_ERROR_MSG];
      }
    });
  },
});

export const { confirmEmail, clearAuth, clearAuthErrors } = authSlice.actions;

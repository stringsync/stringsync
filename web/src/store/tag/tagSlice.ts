import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Tag } from '../../domain';
import { TagClient } from '../../graphql';
import { TagReducers, TagState } from './types';

export type GetTagsReturned = { tags: Tag[] };
export type GetTagsThunkArg = void;
export type GetTagsThunkConfig = { rejectValue: { errors: string[] } };
export const getTags = createAsyncThunk<GetTagsReturned, GetTagsThunkArg, GetTagsThunkConfig>(
  'tag/getTags',
  async (_, thunk) => {
    const tagClient = TagClient.create();
    const { data, errors } = await tagClient.tags();
    if (errors) {
      return thunk.rejectWithValue({ errors: errors.map((error) => error.message) });
    }
    return {
      tags: data.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
    };
  }
);

export const tagSlice = createSlice<TagState, TagReducers, 'tag'>({
  name: 'tag',
  initialState: {
    isPending: false,
    tags: [],
    errors: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTags.pending, (state) => {
      state.isPending = true;
      state.errors = [];
    });
    builder.addCase(getTags.fulfilled, (state, action) => {
      state.isPending = false;
      state.tags = action.payload.tags;
    });
    builder.addCase(getTags.rejected, (state, action) => {
      state.isPending = false;
      if (action.payload) {
        state.errors = action.payload.errors;
      } else if (action.error.message) {
        state.errors = [action.error.message];
      } else {
        state.errors = ['could not fetch tags'];
      }
    });
  },
});

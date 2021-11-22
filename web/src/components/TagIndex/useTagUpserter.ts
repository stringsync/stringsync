import { useCallback } from 'react';
import { Tag } from '../../domain';
import { UNKNOWN_ERROR_MSG } from '../../errors';
import { $gql, CreateTagInput, t, TagCategory, UpdateTagInput } from '../../graphql';
import { useGql } from '../../hooks/useGql';

type TagInput = {
  id?: string;
  name: string;
  category: TagCategory;
};

type UpsertTag = (input: TagInput) => void;
type Loading = boolean;
type SuccessCallback = (tag: Tag) => void;
type ErrorsCallback = (errors: string[]) => void;

const UPDATE_TAG_GQL = $gql
  .mutation('updateTag')
  .setQuery({
    id: t.string,
    name: t.string,
    category: t.optional.oneOf(TagCategory)!,
  })
  .setVariables<{ input: UpdateTagInput }>({
    input: {
      id: t.string,
      name: t.string,
      category: t.optional.oneOf(TagCategory),
    },
  })
  .build();

const CREATE_TAG_INPUT = $gql
  .mutation('createTag')
  .setQuery({
    id: t.string,
    name: t.string,
    category: t.optional.oneOf(TagCategory)!,
  })
  .setVariables<{ input: CreateTagInput }>({
    input: {
      name: t.string,
      category: t.optional.oneOf(TagCategory)!,
    },
  })
  .build();

export const useTagUpserter = (onSuccess: SuccessCallback, onErrors: ErrorsCallback): [UpsertTag, Loading] => {
  const { execute: createTag, loading: creating } = useGql(CREATE_TAG_INPUT, {
    onData: (data) => {
      if (!data.createTag) {
        onErrors([UNKNOWN_ERROR_MSG]);
      } else {
        onSuccess(data.createTag);
      }
    },
    onErrors: (errors: string[]) => {
      onErrors(errors);
    },
  });
  const { execute: updateTag, loading: updating } = useGql(UPDATE_TAG_GQL, {
    onData: (data) => {
      if (!data.updateTag) {
        onErrors([UNKNOWN_ERROR_MSG]);
      } else {
        onSuccess(data.updateTag);
      }
    },
    onErrors: (errors: string[]) => {
      onErrors(errors);
    },
  });
  const loading = creating || updating;

  const upsertTag = useCallback(
    (input: TagInput) => {
      if (loading) {
        return;
      }
      const id = input.id;
      if (id) {
        updateTag({ input: { ...input, id } });
      } else {
        createTag({ input: { name: input.name, category: input.category } });
      }
    },
    [loading, createTag, updateTag]
  );

  return [upsertTag, loading];
};

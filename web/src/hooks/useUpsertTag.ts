import { useCallback } from 'react';
import { Tag } from '../domain';
import { UNKNOWN_ERROR_MSG } from '../lib/errors';
import { $gql, CreateTagInput, CreateTagOutput, t, TagCategory, UpdateTagInput, UpdateTagOutput } from '../lib/graphql';
import { GqlStatus, useGql } from './useGql';
import { useGqlHandler } from './useGqlHandler';

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
    ...t.union<UpdateTagOutput>()({
      Tag: {
        __typename: t.constant('Tag'),
        id: t.string,
        name: t.string,
        category: t.optional.oneOf(TagCategory)!,
      },
      ForbiddenError: {
        __typename: t.constant('ForbiddenError'),
        message: t.string,
      },
      BadRequestError: {
        __typename: t.constant('BadRequestError'),
        message: t.string,
      },
      NotFoundError: {
        __typename: t.constant('NotFoundError'),
        message: t.string,
      },
      ValidationError: {
        __typename: t.constant('ValidationError'),
        details: [t.string],
      },
      UnknownError: {
        __typename: t.constant('UnknownError'),
        message: t.string,
      },
    }),
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
    ...t.union<CreateTagOutput>()({
      Tag: {
        __typename: t.constant('Tag'),
        id: t.string,
        name: t.string,
        category: t.optional.oneOf(TagCategory)!,
      },
      ForbiddenError: {
        __typename: t.constant('ForbiddenError'),
        message: t.string,
      },
      BadRequestError: {
        __typename: t.constant('BadRequestError'),
        message: t.string,
      },
      ValidationError: {
        __typename: t.constant('ValidationError'),
        details: [t.string],
      },
      UnknownError: {
        __typename: t.constant('UnknownError'),
        message: t.string,
      },
    }),
  })
  .setVariables<{ input: CreateTagInput }>({
    input: {
      name: t.string,
      category: t.optional.oneOf(TagCategory)!,
    },
  })
  .build();

export const useUpsertTag = (onSuccess: SuccessCallback, onErrors: ErrorsCallback): [UpsertTag, Loading] => {
  const [createTag, createTagRes] = useGql(CREATE_TAG_INPUT);
  const creating = createTagRes.status === GqlStatus.Pending;
  useGqlHandler.onSuccess(createTagRes, ({ data }) => {
    switch (data.createTag?.__typename) {
      case 'Tag':
        onSuccess(data.createTag);
        break;
      case 'ValidationError':
        onErrors(data.createTag.details);
        break;
      default:
        onErrors([data.createTag?.message || UNKNOWN_ERROR_MSG]);
    }
  });

  const [updateTag, updateTagRes] = useGql(UPDATE_TAG_GQL);
  const updating = updateTagRes.status === GqlStatus.Pending;
  useGqlHandler.onSuccess(updateTagRes, ({ data }) => {
    switch (data.updateTag?.__typename) {
      case 'Tag':
        onSuccess(data.updateTag);
        break;
      case 'ValidationError':
        onErrors(data.updateTag.details);
        break;
      default:
        onErrors([data.updateTag?.message || UNKNOWN_ERROR_MSG]);
    }
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

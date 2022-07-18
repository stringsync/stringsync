import { $gql, CreateNotationInput, CreateNotationOutput, t } from '../lib/graphql';
import { useGql } from './useGql';

const CREATE_NOTATION_GQL = $gql
  .mutation('createNotation')
  .setQuery({
    ...t.union<CreateNotationOutput>()({
      Notation: {
        __typename: t.constant('Notation'),
        id: t.string,
      },
      ForbiddenError: {
        __typename: t.constant('ForbiddenError'),
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
  .setVariables<{ input: CreateNotationInput }>({
    input: {
      artistName: t.string,
      songName: t.string,
      tagIds: [t.string],
      thumbnail: t.file,
      video: t.file,
    },
  })
  .build();

export const useCreateNotation = () => useGql(CREATE_NOTATION_GQL);

import { useMemo, useState } from 'react';
import { UNKNOWN_ERROR_MSG } from '../errors';
import { $gql, DataOf, QueryNotationArgs, t, TagCategory, UpdateNotationInput, UpdateNotationOutput } from '../graphql';
import { Nullable } from '../util/types';
import { useGql, UseGqlOptions } from './useGql';

export type NotationData = DataOf<typeof NOTATION_GQL>;
type GetNotationOpts = UseGqlOptions<typeof NOTATION_GQL>;
type UpdateNotationOpts = UseGqlOptions<typeof UPDATE_NOTATION_GQL>;

const NOTATION_GQL = $gql
  .query('notation')
  .setQuery({
    id: t.string,
    createdAt: t.string,
    updatedAt: t.string,
    songName: t.string,
    artistName: t.string,
    deadTimeMs: t.number,
    durationMs: t.number,
    private: t.boolean,
    transcriberId: t.string,
    thumbnailUrl: t.optional.string,
    videoUrl: t.optional.string,
    musicXmlUrl: t.optional.string,
    transcriber: { id: t.string, username: t.string },
    tags: [{ id: t.string, category: t.optional.oneOf(TagCategory)!, name: t.string }],
  })
  .setVariables<QueryNotationArgs>({ id: t.string })
  .build();

const UPDATE_NOTATION_GQL = $gql
  .mutation('updateNotation')
  .setQuery({
    ...t.union<UpdateNotationOutput>()({
      Notation: {
        __typename: t.constant('Notation'),
        id: t.string,
        createdAt: t.string,
        updatedAt: t.string,
        songName: t.string,
        artistName: t.string,
        deadTimeMs: t.number,
        durationMs: t.number,
        private: t.boolean,
        transcriberId: t.string,
        thumbnailUrl: t.optional.string,
        videoUrl: t.optional.string,
        musicXmlUrl: t.optional.string,
        transcriber: { id: t.string, username: t.string },
        tags: [{ id: t.string, category: t.optional.oneOf(TagCategory)!, name: t.string }],
      },
      ForbiddenError: {
        __typename: t.constant('ForbiddenError'),
        message: t.string,
      },
      NotFoundError: {
        __typename: t.constant('NotFoundError'),
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
  .setVariables<{ input: UpdateNotationInput }>({
    input: {
      id: t.string,
      artistName: t.string,
      songName: t.string,
      deadTimeMs: t.number,
      durationMs: t.number,
      private: t.boolean,
      musicXml: t.optional.file,
      thumbnail: t.optional.file,
    },
  })
  .build();

export const useNotationEditApi = () => {
  const [notation, setNotation] = useState<Nullable<NotationData>>(null);
  const [errors, setErrors] = useState(new Array<string>());

  const getOpts = useMemo<GetNotationOpts>(
    () => ({
      onData: (data) => {
        setNotation(data.notation);
      },
      onErrors: (errors) => {
        setErrors(errors);
      },
    }),
    []
  );
  const { execute: getNotation, loading: getLoading } = useGql(NOTATION_GQL, getOpts);

  const updateOpts = useMemo<UpdateNotationOpts>(
    () => ({
      onData: (data) => {
        switch (data.updateNotation?.__typename) {
          case 'Notation':
            setNotation(data.updateNotation);
            break;
          case 'ValidationError':
            setErrors(data.updateNotation.details);
            break;
          default:
            setErrors([data.updateNotation?.message || UNKNOWN_ERROR_MSG]);
        }
      },
    }),
    []
  );
  const { execute: updateNotation, loading: updateLoading } = useGql(UPDATE_NOTATION_GQL, updateOpts);

  return useMemo(
    () => ({
      notation,
      errors,
      getLoading,
      updateLoading,
      getNotation,
      updateNotation,
    }),
    [notation, errors, getLoading, updateLoading, getNotation, updateNotation]
  );
};

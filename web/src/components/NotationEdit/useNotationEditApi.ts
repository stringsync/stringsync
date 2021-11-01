import { useMemo, useState } from 'react';
import { $gql, DataOf, QueryNotationArgs, t, TagCategory, UpdateNotationInput } from '../../graphql';
import { useGql, UseGqlOptions } from '../../hooks/useGql';
import { Nullable } from '../../util/types';

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
        setNotation(data.updateNotation);
      },
      onErrors: (errors) => {
        setErrors(errors);
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

import { useEffect, useState } from 'react';
import { $gql, DataOf, QueryNotationArgs, t, TagCategory } from '../lib/graphql';
import { Nullable } from '../util/types';
import { GqlStatus, useGql } from './useGql';
import { useGqlHandler } from './useGqlHandler';

export type Notation = DataOf<typeof NOTATION_GQL>;
type Errors = string[];
type Loading = boolean;

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

export const useNotation = (id: string): [Nullable<Notation>, Errors, Loading] => {
  const [notation, setNotation] = useState<Nullable<Notation>>(null);
  const [errors, setErrors] = useState(new Array<string>());

  const [execute, res] = useGql(NOTATION_GQL);
  const loading = res.status === GqlStatus.Init || res.status === GqlStatus.Pending;
  useGqlHandler
    .onPending(res, () => {
      setErrors([]);
    })
    .onSuccess(res, ({ data }) => {
      if (!data.notation) {
        setErrors([`could not find notation: '${id}'`]);
      } else {
        setNotation(data.notation);
      }
    })
    .onErrors(res, ({ errors }) => {
      setErrors(errors);
    });

  useEffect(() => {
    if (id) {
      execute({ id });
    }
  }, [execute, id]);

  return [notation, errors, loading];
};

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  $gql,
  DataOf,
  QueryNotationArgs,
  t,
  TagCategory,
  UpdateNotationInput,
  UpdateNotationOutput,
} from '../lib/graphql';
import { Nullable } from '../util/types';
import { GqlStatus, useGql } from './useGql';

export type NotationData = DataOf<typeof NOTATION_GQL>;

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

export type NotationEditor = {
  notation: Nullable<NotationData>;
  fetchNotationErrors: string[];
  updateNotationErrors: string[];
  fetching: boolean;
  updating: boolean;
  reset: () => void;
  fetchNotation: (variables: { id: string }) => void;
  updateNotation: (variables: { input: UpdateNotationInput }) => void;
  cancelFetchNotation: () => void;
  cancelUpdateNotation: () => void;
};

export const useNotationEditor = (): NotationEditor => {
  const [notation, setNotation] = useState<Nullable<NotationData>>(null);

  // fetch
  const [fetchNotation, fetchNotationRes, cancelFetchNotation] = useGql(NOTATION_GQL);
  const [fetchNotationErrors, setFetchNotationErrors] = useState(new Array<string>());
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    switch (fetchNotationRes.status) {
      case GqlStatus.Init:
        setFetching(false);
        break;
      case GqlStatus.Pending:
        setFetching(true);
        break;
      case GqlStatus.Success:
        if (fetchNotationRes.data.notation) {
          setNotation(fetchNotationRes.data.notation);
        } else {
          setFetchNotationErrors([`could not find notation`]);
        }
        setFetching(false);
        break;
      case GqlStatus.Errors:
        setFetchNotationErrors([...fetchNotationRes.errors]);
        setFetching(false);
        break;
      case GqlStatus.Cancelled:
        setFetching(false);
        break;
    }
  }, [fetchNotationRes]);

  // update
  const [updateNotation, updateNotationRes, cancelUpdateNotation] = useGql(UPDATE_NOTATION_GQL);
  const [updateNotationErrors, setUpdateNotationErrors] = useState(new Array<string>());
  const [updating, setUpdating] = useState(false);
  useEffect(() => {
    switch (updateNotationRes.status) {
      case GqlStatus.Init:
        setUpdating(false);
        break;
      case GqlStatus.Pending:
        setUpdating(true);
        break;
      case GqlStatus.Success:
        switch (updateNotationRes.data.updateNotation?.__typename) {
          case 'Notation':
            setNotation(updateNotationRes.data.updateNotation);
            break;
          case 'BadRequestError':
          case 'ForbiddenError':
          case 'NotFoundError':
          case 'UnknownError':
            setUpdateNotationErrors([updateNotationRes.data.updateNotation.message]);
            break;
          case 'ValidationError':
            setUpdateNotationErrors([`validation errors: ${updateNotationRes.data.updateNotation.details.join(', ')}`]);
            break;
        }
        setUpdating(false);
        break;
      case GqlStatus.Errors:
        setUpdateNotationErrors([...updateNotationRes.errors]);
        setUpdating(false);
        break;
      case GqlStatus.Cancelled:
        setUpdating(false);
        break;
    }
  }, [updateNotationRes]);

  // prevent the caller from fetching and getting at the same time
  useEffect(() => {
    if (fetchNotationRes.status === GqlStatus.Pending && updateNotationRes.status === GqlStatus.Pending) {
      cancelFetchNotation();
      cancelUpdateNotation();
      const error = 'tried to fetch and update at the same time';
      setFetchNotationErrors([error]);
      setUpdateNotationErrors([error]);
    }
  }, [fetchNotationRes, updateNotationRes, cancelFetchNotation, cancelUpdateNotation]);

  // reset
  const reset = useCallback(() => {
    cancelFetchNotation();
    cancelUpdateNotation();
    setNotation(null);
    setFetchNotationErrors([]);
    setUpdateNotationErrors([]);
    setFetching(false);
    setUpdating(false);
  }, [cancelFetchNotation, cancelUpdateNotation]);

  // editor
  const editor = useMemo<NotationEditor>(
    () => ({
      notation,
      fetchNotationErrors,
      updateNotationErrors,
      fetching,
      updating,
      reset,
      fetchNotation,
      updateNotation,
      cancelFetchNotation,
      cancelUpdateNotation,
    }),
    [
      notation,
      fetchNotationErrors,
      updateNotationErrors,
      fetching,
      updating,
      reset,
      fetchNotation,
      updateNotation,
      cancelFetchNotation,
      cancelUpdateNotation,
    ]
  );

  return editor;
};

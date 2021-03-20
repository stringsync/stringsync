import { ExtractableFile, extractFiles } from 'extract-files';
import { getGraphqlUri } from './getGraphqlUri';
import { Mutation, Query } from './graphqlTypes';
import { RequestType, Response } from './types';

const URI = getGraphqlUri();

export const graphql = async <
  T extends RequestType,
  N extends Exclude<keyof T, '__typename'>,
  V extends Record<string, any> | void = void
>(
  uri: string,
  query: string,
  variables?: V
): Promise<Response<T, N>> => {
  // extract files
  const extraction = extractFiles(
    { query, variables },
    undefined,
    (value: any): value is ExtractableFile => value instanceof File
  );
  const clone = extraction.clone;
  const fileMap = extraction.files;

  // compute map
  const map: { [key: string]: string | string[] } = {};
  const pathGroups = Array.from(fileMap.values());
  for (let ndx = 0; ndx < pathGroups.length; ndx++) {
    const paths = pathGroups[ndx];
    map[ndx] = paths;
  }

  // create form data
  const formData = new FormData();
  formData.append('operations', JSON.stringify(clone));
  formData.append('map', JSON.stringify(map));

  // append files to form data
  const files = Array.from(fileMap.keys());
  for (let ndx = 0; ndx < files.length; ndx++) {
    const file = files[ndx];
    formData.append(ndx.toString(), file as File);
  }

  const res = await fetch(uri, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData,
    credentials: 'include',
    mode: 'cors',
  });
  return await res.json();
};

export const query = async <N extends Exclude<keyof Query, '__typename'>, V extends Record<string, any> | void = void>(
  query: string,
  variables?: V
) => {
  return await graphql<Query, N, V>(URI, query, variables);
};

export const mutation = async <
  N extends Exclude<keyof Mutation, '__typename'>,
  V extends Record<string, any> | void = void
>(
  query: string,
  variables?: V
) => {
  return await graphql<Mutation, N, V>(URI, query, variables);
};

import { ExtractableFile, extractFiles } from 'extract-files';
import { WEB_CONFIG } from '../../config';
import { RequestType, Response } from './types';

export class GraphqlClient {
  readonly uri: string;

  static create() {
    const uri = GraphqlClient.getGraphqlUri();
    return new GraphqlClient(uri);
  }

  static getGraphqlUri(env = process.env): string {
    const config = WEB_CONFIG(env);
    return config.REACT_APP_SERVER_URI + config.REACT_APP_GRAPHQL_ENDPOINT;
  }

  constructor(uri: string) {
    this.uri = uri;
  }

  call = async <
    T extends RequestType,
    N extends Exclude<keyof T, '__typename'>,
    V extends Record<string, any> | void = void
  >(
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

    const res = await fetch(this.uri, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
      credentials: 'include',
      mode: 'cors',
    });
    return await res.json();
  };
}

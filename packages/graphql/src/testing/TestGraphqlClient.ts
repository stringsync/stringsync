import { randStr } from '@stringsync/common';
import { Express } from 'express';
import { ExtractableFile, extractFiles } from 'extract-files';
import request, { SuperAgentTest } from 'supertest';
import { Response } from './types';

export class TestGraphqlClient {
  app: Express;
  agent: SuperAgentTest;

  constructor(app: Express) {
    this.app = app;
    this.agent = request.agent(app);
  }

  call = async <T, N extends string, V extends Record<string, any> | void = void>(
    query: string,
    variables?: V
  ): Promise<Response<T, N>> => {
    // extract files
    const { clone, files } = extractFiles(
      { query, variables },
      undefined,
      (value: any): value is ExtractableFile => value instanceof Buffer
    );

    // compute map
    const map: { [key: string]: string | string[] } = {};
    const pathGroups = Array.from(files.values());
    for (let ndx = 0; ndx < pathGroups.length; ndx++) {
      const paths = pathGroups[ndx];
      map[ndx] = paths;
    }

    // compute buffers
    const promises = new Array<Promise<Buffer>>();
    for (const [buffer, _] of files.entries()) {
      promises.push(buffer as any);
    }
    const buffers = await Promise.all(promises);

    // make request
    return await new Promise((resolve, reject) => {
      const req = this.agent
        .post('/graphql')
        .field('operations', JSON.stringify(clone))
        .field('map', JSON.stringify(map));

      for (let ndx = 0; ndx < buffers.length; ndx++) {
        const buffer = buffers[ndx];
        req.attach(ndx.toString(), buffer, { filename: randStr(10) });
      }

      return req.end((err, res: any) => (err ? reject(err) : resolve(res)));
    });
  };
}

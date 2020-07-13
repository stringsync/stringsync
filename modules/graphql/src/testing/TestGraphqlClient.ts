import { get } from 'lodash';
import { Express, Response } from 'express';
import request, { SuperAgentTest } from 'supertest';
import { CallResponse } from './types';
import { HTTP_STATUSES } from '@stringsync/common';

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
  ): Promise<Response & { body: CallResponse<T, N> }> => {
    return new Promise((resolve, reject) =>
      this.agent
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ query, variables })
        .end((err, res: any) => {
          if (err) {
            // HTTP req was not successful. Responses with errors should still resolve.
            reject(err);
          }
          if (res.error) {
            // HTTP req was successful, but there was an error.
            const status = get(
              JSON.parse(res.error.text),
              'errors[0].extensions.status',
              HTTP_STATUSES.INTERNAL_SERVER_ERROR
            );
            res.status = status;
            res.statusCode = status;
            res.statusType = Math.floor(status / 100);
          }
          resolve(res);
        })
    );
  };
}

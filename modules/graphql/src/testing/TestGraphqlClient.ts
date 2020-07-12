import { Express, Response } from 'express';
import request, { SuperAgentTest } from 'supertest';
import { CallResponse } from './types';

export class TestGraphqlClient {
  app: Express;
  agent: SuperAgentTest;

  constructor(app: Express) {
    this.app = app;
    this.agent = request.agent(app);
  }

  call<T, N extends string, V extends Record<string, any> | void = void>(
    query: string,
    variables?: V
  ): Promise<Response & { body: CallResponse<T, N> }> {
    return new Promise((resolve, reject) =>
      this.agent
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ query, variables })
        .end((err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res as any);
        })
    );
  }
}

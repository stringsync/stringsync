import { app } from './app';
import { useTestContainer } from '@stringsync/container';
import request, { SuperTest, Test } from 'supertest';
import { HTTP_STATUSES, OnlyKey } from '@stringsync/common';
import { GraphQLError } from 'graphql';
import { Query } from './graphqlTypes';

type CallResponse<T, N extends string> = {
  errors?: GraphQLError[];
  data: OnlyKey<N, T>;
};

let req: SuperTest<Test>;

const container = useTestContainer();

beforeEach(() => {
  req = request(app(container));
});

describe('GET /health', () => {
  it('responds with 200', (done) => {
    req.get('/health').expect(200, done);
  });
});

describe('POST /graphql', () => {
  const gql = (strings: TemplateStringsArray) => strings.join('');

  const gqlReq = <T, N extends string, V extends Record<string, any> | void>(
    status: number,
    query: string,
    variables?: V
  ) =>
    new Promise<CallResponse<T, N>>((resolve, reject) => {
      req
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ query, variables })
        .expect(status)
        .end((err, res) => {
          if (err) reject(err);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty('data');
          resolve(res.body);
        });
    });

  describe('whoami', () => {
    it('returns null when logged out', async () => {
      const res = await gqlReq<Query['whoami'], 'whoami', undefined>(
        HTTP_STATUSES.OK,
        gql`
          query {
            whoami {
              id
            }
          }
        `
      );

      expect(res.data.whoami).toBeNull();
    });
  });
});

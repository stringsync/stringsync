import { app } from './app';
import { useTestContainer } from '@stringsync/container';
import request, { SuperTest, Test, CallbackHandler } from 'supertest';

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

  const gqlReq = (query: string, variables?: Record<string, any>, status = 200) =>
    new Promise<any>((resolve, reject) => {
      req
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ query, variables })
        .expect(status)
        .end((err, res) => {
          if (err) reject(err);
          expect(res.body).toHaveProperty('data');
          resolve(res.body.data);
        });
    });

  describe('whoami', () => {
    it('returns null when logged out', async () => {
      const data = await gqlReq(gql`
        query {
          whoami {
            id
          }
        }
      `);
      expect(data.whoami).toBeNull();
    });
  });
});

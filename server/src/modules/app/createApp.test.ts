import { createApp } from '.';
import supertest from 'supertest';
import sinon from 'sinon';
import { makeExecutableSchema, gql } from 'apollo-server';
import HttpStatus from 'common/http-status-codes';
import { GraphQLError } from 'graphql';

// The purpose of these tests is to test that createApp plumbs middlewares
// correctly.

const SUCCESSFUL_RESOLVER_RETURN_VALUE = 'RESOLVER_RETURN_VALUE';
const SECRET_INTERNAL_SERVER_DETAILS = 'SECRET_INTERNAL_SERVER_DETAILS';
const ALLOWED_CLIENT_URI = 'http://stringsync.com';
const DISALLOWED_CLIENT_URI = 'http://literally-any-other-uri';

const req = (env: string) => {
  const app = createApp({
    db: {
      connection: sinon.mock() as any,
      models: sinon.mock() as any,
    },
    clientUri: ALLOWED_CLIENT_URI,
    env,
    schema: makeExecutableSchema({
      typeDefs: gql`
        type Query {
          successfulResolver: String!
          unsuccessfulResolver: String
        }
      `,
      resolvers: {
        Query: {
          successfulResolver: () => SUCCESSFUL_RESOLVER_RETURN_VALUE,
          unsuccessfulResolver: () => {
            throw new GraphQLError(SECRET_INTERNAL_SERVER_DETAILS);
          },
        },
      },
    }),
  });
  return supertest(app);
};

test('POST /graphql with valid query responds with OK', (done) => {
  req('test')
    .post('/graphql')
    .send({ query: '{ successfulResolver }' })
    .expect('Content-Type', /json/)
    .expect(HttpStatus.OK)
    .end((err, res) => {
      if (err) done(err);
      expect(JSON.parse(res.text)).toEqual({
        data: { successfulResolver: SUCCESSFUL_RESOLVER_RETURN_VALUE },
      });
      done();
    });
});

// TODO, fix this test
test('POST /graphql with invalid origin responds with ???', (done) => {
  req('test')
    .post('/graphql')
    .set('Origin', DISALLOWED_CLIENT_URI)
    .send({ query: '{ successfulResolver }' })
    .expect('Content-Type', /json/)
    .expect(HttpStatus.OK, done);
});

test('POST /graphql with invalid query responds with BAD_REQUEST', (done) => {
  req('test')
    .post('/graphql')
    .send({ query: '{ doesNotExistResolver }' })
    .expect('Content-Type', /json/)
    .expect(HttpStatus.BAD_REQUEST, done);
});

test('POST /graphql in prod env does not expose internal server errors', (done) => {
  req('production')
    .post('/graphql')
    .send({ query: '{ unsuccessfulResolver }' })
    .expect('Content-Type', /json/)
    .expect(HttpStatus.OK)
    .end((err, res) => {
      if (err) done(err);
      expect(res.text).not.toContain(SECRET_INTERNAL_SERVER_DETAILS);
      done();
    });
});

test('POST /graphql in dev env exposes internal server errors', (done) => {
  req('development')
    .post('/graphql')
    .send({ query: '{ unsuccessfulResolver }' })
    .expect('Content-Type', /json/)
    .expect(HttpStatus.OK)
    .end((err, res) => {
      if (err) done(err);
      expect(res.text).toContain(SECRET_INTERNAL_SERVER_DETAILS);
      done();
    });
});

import { HTTP_STATUSES } from '@stringsync/common';
import request, { SuperTest, Test } from 'supertest';
import { useTestApp, TestGraphqlClient, gql } from '../testing';
import { Query, Mutation, LoginInput } from '../testing/graphqlTypes';
import { AuthService } from '@stringsync/services';
import { TYPES } from '@stringsync/container';

const { app, container } = useTestApp();

let req: SuperTest<Test>;

beforeEach(() => {
  req = request(app);
});

describe('GET /health', () => {
  it('responds with 200', (done) => {
    req.get('/health').expect(200, done);
  });
});

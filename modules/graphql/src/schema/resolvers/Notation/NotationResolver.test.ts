import { TestGraphqlClient, useTestApp } from '../../../testing';
import { HTTP_STATUSES, randStr } from '@stringsync/common';
import { TestNotationClient } from './TestNotationClient';

const { app, container } = useTestApp();

let graphqlClient: TestGraphqlClient;
let notationClient: TestNotationClient;

beforeEach(() => {
  graphqlClient = new TestGraphqlClient(app);
  notationClient = new TestNotationClient(graphqlClient);
});

describe('notations', () => {
  it('runs without crashing', async () => {
    const notationsRes = await notationClient.notations({});
    expect(notationsRes.statusCode).toBe(HTTP_STATUSES.OK);
  });
});

import { HTTP_STATUSES, TestFactory } from '@stringsync/common';
import { TYPES } from '@stringsync/container';
import { Notation, User, UserRole } from '@stringsync/domain';
import { NotationRepo, UserRepo } from '@stringsync/repos';
import { TestGraphqlClient, useTestApp } from '../../../testing';
import { TestNotationClient } from './TestNotationClient';
import { sortBy } from 'lodash';

const { app, container } = useTestApp();

let userRepo: UserRepo;
let notationRepo: NotationRepo;

let teacher: User;
let notations: Notation[];

let graphqlClient: TestGraphqlClient;
let notationClient: TestNotationClient;

beforeEach(() => {
  userRepo = container.get<UserRepo>(TYPES.UserRepo);
  notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);

  graphqlClient = new TestGraphqlClient(app);
  notationClient = new TestNotationClient(graphqlClient);
});

beforeEach(async () => {
  teacher = await userRepo.create(TestFactory.buildRandUser({ role: UserRole.TEACHER }));
  notations = await notationRepo.bulkCreate([
    TestFactory.buildRandNotation({ transcriberId: teacher.id }),
    TestFactory.buildRandNotation({ transcriberId: teacher.id }),
    TestFactory.buildRandNotation({ transcriberId: teacher.id }),
  ]);
});

describe('notations', () => {
  it('returns the notation records', async () => {
    const notationsRes = await notationClient.notations({});
    expect(notationsRes.statusCode).toBe(HTTP_STATUSES.OK);

    const notationIds = notationsRes.body.data.notations.edges.map((edge) => edge.node.id);
    const expectedNotationIds = notations.map((notation) => notation.id);
    expect(notationIds.sort()).toStrictEqual(expectedNotationIds.sort());
  });

  it('returns the first N records', async () => {
    const notationsRes = await notationClient.notations({ first: 1 });
    expect(notationsRes.statusCode).toBe(HTTP_STATUSES.OK);

    const notationIds = notationsRes.body.data.notations.edges.map((edge) => edge.node.id);
    const firstNotationIdByRank = sortBy(notations, (notation) => notation.rank).reverse()[0].id;
    expect(notationIds).toStrictEqual([firstNotationIdByRank]);
  });
});

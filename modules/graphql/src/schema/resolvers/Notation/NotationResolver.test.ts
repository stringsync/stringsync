import { HttpStatus, TestFactory, randStr } from '@stringsync/common';
import { TYPES } from '@stringsync/container';
import { Notation, User, UserRole } from '@stringsync/domain';
import { NotationRepo, UserRepo } from '@stringsync/repos';
import { TestGraphqlClient, useTestApp } from '../../../testing';
import { TestNotationClient } from './TestNotationClient';
import { sortBy } from 'lodash';
import { TestAuthClient } from '../Auth/TestAuthClient';
import * as bcrypt from 'bcrypt';
import { AuthService } from '@stringsync/services';

const { app, container } = useTestApp();

let userRepo: UserRepo;
let notationRepo: NotationRepo;

let teacher: User;
let admin: User;
let password: string;
let notations: Notation[];

let graphqlClient: TestGraphqlClient;
let notationClient: TestNotationClient;
let authClient: TestAuthClient;

beforeEach(() => {
  userRepo = container.get<UserRepo>(TYPES.UserRepo);
  notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);

  graphqlClient = new TestGraphqlClient(app);
  notationClient = new TestNotationClient(graphqlClient);
  authClient = new TestAuthClient(graphqlClient);
});

beforeEach(async () => {
  password = randStr(10);
  const encryptedPassword = await bcrypt.hash(password, AuthService.HASH_ROUNDS);
  [teacher, admin] = await userRepo.bulkCreate([
    TestFactory.buildRandUser({ encryptedPassword, role: UserRole.TEACHER }),
    TestFactory.buildRandUser({ encryptedPassword, role: UserRole.ADMIN }),
  ]);
  notations = await notationRepo.bulkCreate([
    TestFactory.buildRandNotation({ transcriberId: teacher.id }),
    TestFactory.buildRandNotation({ transcriberId: teacher.id }),
    TestFactory.buildRandNotation({ transcriberId: teacher.id }),
  ]);
});

describe('notations', () => {
  it('returns the notation records', async () => {
    const notationsRes = await notationClient.notations({});
    expect(notationsRes.statusCode).toBe(HttpStatus.OK);

    const notationIds = notationsRes.body.data.notations.edges.map((edge) => edge.node.id);
    const expectedNotationIds = notations.map((notation) => notation.id);
    expect(notationIds.sort()).toStrictEqual(expectedNotationIds.sort());
  });

  it('returns the first N records', async () => {
    const notationsRes = await notationClient.notations({ first: 1 });
    expect(notationsRes.statusCode).toBe(HttpStatus.OK);

    const notationIds = notationsRes.body.data.notations.edges.map((edge) => edge.node.id);
    const firstNotationIdByRank = sortBy(notations, (notation) => notation.rank).reverse()[0].id;
    expect(notationIds).toStrictEqual([firstNotationIdByRank]);
  });
});

describe('notation', () => {
  it('returns the record matching the id', async () => {
    const id = notations[0].id;

    const notationRes = await notationClient.notation({ id });
    expect(notationRes.statusCode).toBe(HttpStatus.OK);

    const notation = notationRes.body.data.notation;
    expect(notation!.id).toBe(id);
  });

  it('returns null when no record matches', async () => {
    const id = randStr(12);

    const notationRes = await notationClient.notation({ id });
    expect(notationRes.statusCode).toBe(HttpStatus.OK);
    expect(notationRes.body.data.notation).toBeNull();
  });
});

describe('createNotation', () => {
  let songName: string;
  let artistName: string;

  beforeEach(() => {
    songName = randStr(12);
    artistName = randStr(12);
  });

  it('creates a notation record when logged in as teacher', async () => {
    const loginRes = await authClient.login({ usernameOrEmail: teacher.username, password });
    expect(loginRes.statusCode).toBe(HttpStatus.OK);

    const createNotationRes = await notationClient.createNotation({ songName, artistName });
    expect(createNotationRes.statusCode).toBe(HttpStatus.OK);
    const notation = createNotationRes.body.data.createNotation;
    expect(notation.songName).toBe(songName);
    expect(notation.artistName).toBe(artistName);

    const notationRes = await notationClient.notation({ id: notation.id });
    expect(notationRes.statusCode).toBe(HttpStatus.OK);
    const foundNotation = notationRes.body.data.notation;
    expect(foundNotation).not.toBeNull();
    expect(foundNotation!.id).toBe(notation.id);
  });

  it('creates a notation record when logged in as admin', async () => {
    const loginRes = await authClient.login({ usernameOrEmail: teacher.username, password });
    expect(loginRes.statusCode).toBe(HttpStatus.OK);

    const createNotationRes = await notationClient.createNotation({ songName, artistName });
    expect(createNotationRes.statusCode).toBe(HttpStatus.OK);
    const notation = createNotationRes.body.data.createNotation;
    expect(notation.songName).toBe(songName);
    expect(notation.artistName).toBe(artistName);

    const notationRes = await notationClient.notation({ id: notation.id });
    expect(notationRes.statusCode).toBe(HttpStatus.OK);
    const foundNotation = notationRes.body.data.notation;
    expect(foundNotation).not.toBeNull();
    expect(foundNotation!.id).toBe(notation.id);
  });

  it('forbids notation creation when not logged in', async () => {
    const createNotationRes = await notationClient.createNotation({ songName, artistName });
    expect(createNotationRes.statusCode).toBe(HttpStatus.OK);
  });

  it('forbids notation creation when logged in as student', async () => {
    const encryptedPassword = await bcrypt.hash(password, AuthService.HASH_ROUNDS);
    const student = await userRepo.create(TestFactory.buildRandUser({ encryptedPassword, role: UserRole.STUDENT }));

    const loginRes = await authClient.login({ usernameOrEmail: student.username, password });
    expect(loginRes.statusCode).toBe(HttpStatus.OK);

    const createNotationRes = await notationClient.createNotation({ songName, artistName });
    expect(createNotationRes.statusCode).toBe(HttpStatus.OK);
  });
});

import { confirmEmail } from './confirmEmail';
import { useTestReqCtx, getFixtures } from '../../../testing';

const FIXTURES = getFixtures();
const TOKEN1 = 'dfd54b71-368d-49db-b846-f7c9239a0fde';
const TOKEN2 = 'b5861088-bdd3-41a2-9905-00938dbaa612';
const USER = FIXTURES.User.student1;
const USER_SESSION = FIXTURES.UserSession.student1Session;

it(
  'sets confirmed at',
  useTestReqCtx(
    {
      fixtures: {
        User: [
          {
            ...USER,
            confirmationToken: TOKEN1,
            confirmedAt: null,
          },
        ],
        UserSession: [USER_SESSION],
      },
      cookies: {
        USER_SESSION_TOKEN: USER_SESSION.token,
      },
    },
    async (ctx) => {
      const payload = await confirmEmail(
        undefined,
        {
          input: { confirmationToken: TOKEN1 },
        },
        ctx
      );

      const userModel = await ctx.db.models.User.findByPk(payload.id);

      expect(userModel).not.toBeNull();
      expect(userModel!.confirmedAt).not.toBeNull();
    }
  )
);

it(
  'throws an error if the user is not logged in',
  useTestReqCtx({}, async (ctx) => {
    expect(
      confirmEmail(undefined, { input: { confirmationToken: TOKEN1 } }, ctx)
    ).rejects.toThrow();
  })
);

it(
  'throws an error if already confirmed',
  useTestReqCtx(
    {
      fixtures: {
        User: [
          {
            ...USER,
            confirmationToken: TOKEN1,
            confirmedAt: new Date(),
          },
        ],
        UserSession: [USER_SESSION],
      },
      cookies: {
        USER_SESSION_TOKEN: USER_SESSION.token,
      },
    },
    async (ctx) => {
      expect(
        confirmEmail(
          undefined,
          {
            input: { confirmationToken: TOKEN1 },
          },
          ctx
        )
      ).rejects.toThrow();
    }
  )
);

it(
  'throws an error if wrong confirmation token',
  useTestReqCtx(
    {
      fixtures: {
        User: [
          {
            ...USER,
            confirmationToken: TOKEN1,
            confirmedAt: null,
          },
        ],
        UserSession: [USER_SESSION],
      },
      cookies: {
        USER_SESSION_TOKEN: USER_SESSION.token,
      },
    },
    async (ctx) => {
      expect(
        confirmEmail(
          undefined,
          {
            input: { confirmationToken: TOKEN2 },
          },
          ctx
        )
      ).rejects.toThrow();
    }
  )
);

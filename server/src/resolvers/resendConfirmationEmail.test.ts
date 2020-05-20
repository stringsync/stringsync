import { resendConfirmation } from './resendConfirmation';
import { useTestReqCtx, getFixtures } from '../../../testing';
import { UserInputError, ForbiddenError } from 'apollo-server';

const FIXTURES = getFixtures();
const TOKEN = 'dfd54b71-368d-49db-b846-f7c9239a0fde';
const NOW = new Date('2019-01-01');
const PAST = new Date(NOW.getTime() - 1);
const FUTURE = new Date(NOW.getTime() + 1);
const USER1 = FIXTURES.User.student1;
const USER1_SESSION = FIXTURES.UserSession.student1Session;
const USER2 = FIXTURES.User.student2;

it(
  'updates the user confirmationToken',
  useTestReqCtx(
    {
      fixtures: {
        User: [{ ...USER1, confirmationToken: TOKEN, confirmedAt: null }],
        UserSession: [{ ...USER1_SESSION, expiresAt: FUTURE }],
      },
      cookies: {
        USER_SESSION_TOKEN: USER1_SESSION.token,
      },
      requestedAt: NOW,
    },
    async (ctx) => {
      const payload = await resendConfirmation(
        undefined,
        {
          input: { email: USER1.email },
        },
        ctx
      );

      const userModel = await ctx.db.models.User.findOne({
        where: { email: payload.email },
      });

      expect(userModel).not.toBeNull();
      expect(userModel!.confirmationToken).not.toBe(TOKEN);
      expect(userModel!.confirmationToken).not.toBeNull();
    }
  )
);

it(
  'resends a confirmation mail when successful',
  useTestReqCtx(
    {
      fixtures: {
        User: [{ ...USER1, confirmationToken: TOKEN, confirmedAt: null }],
        UserSession: [{ ...USER1_SESSION, expiresAt: FUTURE }],
      },
      cookies: {
        USER_SESSION_TOKEN: USER1_SESSION.token,
      },
      requestedAt: NOW,
    },
    async (ctx) => {
      await resendConfirmation(
        undefined,
        {
          input: { email: USER1.email },
        },
        ctx
      );

      const jobCounts = await ctx.queues.MAIL.count();
      expect(jobCounts).toBe(1);
    }
  )
);

it(
  'throws an error when the email does not exist',
  useTestReqCtx({}, async (ctx) => {
    await expect(
      resendConfirmation(
        undefined,
        {
          input: { email: USER1.email },
        },
        ctx
      )
    ).rejects.toThrowError(new UserInputError('invalid email'));
  })
);

it(
  'throws an error when the email does not exist',
  useTestReqCtx(
    {
      fixtures: {
        User: [
          { ...USER1, confirmationToken: TOKEN, confirmedAt: null },
          USER2,
        ],
        UserSession: [{ ...USER1_SESSION, expiresAt: FUTURE }],
      },
      cookies: {
        USER_SESSION_TOKEN: USER1_SESSION.token,
      },
      requestedAt: NOW,
    },
    async (ctx) => {
      await expect(
        resendConfirmation(
          undefined,
          {
            input: { email: USER2.email },
          },
          ctx
        )
      ).rejects.toThrowError(
        new ForbiddenError(`must be logged in as ${USER2.email}`)
      );
    }
  )
);

it(
  'silently fails if user is already confirmed',
  useTestReqCtx(
    {
      fixtures: {
        User: [{ ...USER1, confirmationToken: TOKEN, confirmedAt: PAST }],
        UserSession: [{ ...USER1_SESSION, expiresAt: FUTURE }],
      },
      cookies: {
        USER_SESSION_TOKEN: USER1_SESSION.token,
      },
      requestedAt: NOW,
    },
    async (ctx) => {
      const payload = await resendConfirmation(
        undefined,
        {
          input: { email: USER1.email },
        },
        ctx
      );

      const userModel = await ctx.db.models.User.findOne({
        where: { email: payload.email },
      });

      expect(userModel).not.toBeNull();
      expect(userModel!.confirmationToken).toBe(TOKEN);
      const jobCounts = await ctx.queues.MAIL.count();
      expect(jobCounts).toBe(0);
    }
  )
);

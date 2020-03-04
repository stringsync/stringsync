import { confirmEmail } from './confirmEmail';
import { getTestStore } from '../../../testing';

it('confirms the email', async () => {
  const id = '964c11ab-1991-4e92-b848-55b22dc8164a';
  const confirmationToken = 'ed9e9ce7-2733-4f3c-9ca4-6a74a87c9fc5';
  const { store, client, thunkArgs } = getTestStore();

  jest.spyOn(client, 'call').mockResolvedValueOnce({ id });

  await confirmEmail({
    confirmationToken,
  })(...thunkArgs);

  const { email } = store.getState();
  expect(email.isConfirmed).toBe(true);
  expect(email.isPending).toBe(false);
  expect(email.errors).toHaveLength(0);
});

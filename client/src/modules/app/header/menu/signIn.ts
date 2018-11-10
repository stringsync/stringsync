import * as serviceWorker from '../../../../serviceWorker';

export const signIn = async (provider: 'google' | 'facebook') => {
  serviceWorker.unregister();
  const { auth } = window.ss;

  try {
    const user = await auth.oAuthSignIn({ provider });
    auth.validateToken();
    window.ss.message.info(`signed in as ${user.name}`);
  } catch (error) {
    console.error(error);
    window.ss.message.error('could not sign in');
  }
};

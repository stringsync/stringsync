import { compose, withHandlers, mapProps } from 'recompose';
import { connect } from 'react-redux';
import { SessionActions } from '../data/session/sessionActions';
import { ISession } from '../@types/user';
import * as serviceWorker from '../serviceWorker';

interface IConnectProps {
  setSession: (user: ISession) => void;
  resetSession: () => void;
}

export interface IWithAuthProps {
  signIn: (provider: string) => void;
  signOut: () => void;
}

export const withAuth = <TProps = {}>(BaseComponent: any) => {
  const enhance = compose(
    connect(
      null,
      dispatch => ({
        setSession: (user: ISession) => dispatch(SessionActions.setSession(user)),
        resetSession: () => dispatch(SessionActions.resetSession())
      }),
    ),
    withHandlers<IConnectProps & TProps, IWithAuthProps>({
      signIn: props => async (provider: string) => {
        serviceWorker.unregister();

        try {
          const user = await window.ss.auth.oAuthSignIn({ provider });
          props.setSession(user);
          window.ss.message.info(`signed in as ${user.name}`);
        } catch (error) {
          console.error(error);
          window.ss.message.error('could not sign in');
        } finally {
          serviceWorker.register();
        }
      },
      signOut: props => async () => {
        serviceWorker.unregister();

        try {
          await window.ss.auth.signOut();
          props.resetSession();
          window.ss.message.info('signed out');
        } catch (error) {
          console.error(error);
          window.ss.message.error('could not sign out');
        } finally {
          serviceWorker.register();
        }
      }
    }),
    mapProps<TProps & IWithAuthProps, any>(props => {
      const nextProps = Object.assign({}, props);
      delete nextProps.setSession;
      delete nextProps.resetSession;
      return nextProps;
    })
  );

  return enhance(BaseComponent);
};

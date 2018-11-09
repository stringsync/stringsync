import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { IStore } from '../../@types/store';

interface IProps {
  requireSignIn: boolean;
  signedIn: boolean;
}

const enhance = compose(
  connect((state: IStore) => ({ signedIn: state.session.signedIn }))
);

const render = (Component: React.ComponentClass<any> | React.SFC<any>, props: IProps) => () => {
  if (props.requireSignIn) {
    return props.signedIn ? <Component {...props} /> : <Redirect to="/login" />;
  } else {
    return props.signedIn ? <Redirect to="/" /> : <Component {...props} />;
  }
};

/**
 * This component is used to conditionally allow the mounting of a component solely
 * based on state.session.signedIn.
 * Specifying requireSignIn as true will require the user to be signed in to mount the component.
 * Specifying requireSignIn as false will require the user NOT to be signed in to mount the component.
 */
export const AuthRoute: React.ComponentClass<any> = enhance((props: any) => {
  const { component, requireSignIn, signedIn, ...restProps } = props;
  const innerProps = { requireSignIn, signedIn, ...restProps };
  return <Route {...restProps} render={render(component, innerProps)} />;
});

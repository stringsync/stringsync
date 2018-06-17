import * as React from 'react';
import styled from 'react-emotion';
import { Form, Icon, Input, Button } from 'antd';
import { compose, withState, withHandlers, withProps } from 'recompose';
import { Link } from 'react-router-dom';
import { SessionErrors } from '../';
import { connect } from 'react-redux';
import { login, SessionActions } from 'data';
import { IAuthResponse } from 'j-toker';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const { Item } = Form;

interface IInnerProps {
  form: WrappedFormUtils;
  loading: boolean;
  errors: string[];
  login: (user: User.ILoginUser) => IAuthResponse;
  setSession: (user: User.ILoginUser) => void;
  setLoading: (loading: boolean) => void;
  setErrors: (errors: string[]) => void;
  handlePasswordClear: () => void;
  handlePasswordInputRef: () => void;
  handleLoginError: () => void;
  handleLoginSuccess: (res: IAuthResponse) => void;
  doLogin: (user: User.ILoginUser) => void;
  afterValidate: (errors?: string[], user?: User.ILoginUser) => void;
  handleSubmit: (event: React.SyntheticEvent<HTMLElement>) => void;
}

const enhance = compose<IInnerProps, {}>(
  Form.create(),
  connect(
    null,
    dispatch => ({
      login: (user: User.ILoginUser) => dispatch(login(user) as any),
      setSession: (user: User.ISessionUser) => dispatch(SessionActions.setSession(user))
    })
  ),
  withState('loading', 'setLoading', false),
  withState('errors', 'setErrors', []),
  withHandlers(() => {
    let passwordInput: HTMLInputElement;

    return ({
      handlePasswordClear: () => () => {
        if (passwordInput) {
          passwordInput.focus();
        }
      },
      handlePasswordInputRef: () => (ref: HTMLInputElement) => {
        passwordInput = ref;
      }
    })
  }),
  withHandlers({
    handleLoginError: (props: any) => (errors: string[]) => {
      props.setLoading(false);
      props.form.setFields({ password: { value: '' } });
      props.handlePasswordClear();
      props.setErrors(errors);
    },
    handleLoginSuccess: (props: any) => (res: IAuthResponse) => {
      // We redirect to the home page, so we don't bother setting the loading to false,
      // since we don't want to call setState on an unmounted component.
      window.ss.message.success(`signed in as ${res.data.name}`);
    }
  }),
  withProps((props: any) => ({
    doLogin: async (user: User.ILoginUser) => {
      props.setLoading(true);

      try {
        const response = await props.login(user);
        props.handleLoginSuccess(response);
      } catch (error) {
        props.handleLoginError(error.data.errors);
      }
    }
  })),
  withHandlers({
    afterValidate: (props: any) => (errors: string[], user: User.ILoginUser) => {
      if (!errors) {
        props.doLogin(user);
      }
    }
  }),
  withHandlers({
    handleSubmit: (props: any) => (event: React.SyntheticEvent<HTMLElement>) => {
      event.preventDefault();
      props.form.validateFields(props.afterValidate);
    }
  })
);

const Outer = styled('div')`
  transition: height 500ms ease-in;
`;

const LoginButton = styled(Button)`
  width: 100%;
`;

const Footer = styled('div')`
  width: 100%;
  text-align: center;
`;

export const LoginForm = enhance(props => (
  <Outer>
    <Form onSubmit={props.handleSubmit}>
      <Item>
        {props.form.getFieldDecorator('email', {
          rules: [{ required: true, message: 'email cannot be blank' }],
        })(
          <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="email" />
        )}
      </Item>
      <Item>
        {props.form.getFieldDecorator('password', {
          rules: [{ required: true, message: 'password cannot be blank' }],
        })(
          <Input
            type="password"
            placeholder="password"
            ref={props.handlePasswordInputRef}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
        )}
      </Item>
      <Item>
        <LoginButton type="primary" htmlType="submit" loading={props.loading}>
          login
        </LoginButton>
      </Item>
    </Form>
    <Footer>
      or <Link to="/signup">register now!</Link>
    </Footer>
    <Footer>
      <SessionErrors errors={props.errors} />
    </Footer>
  </Outer>
));

export default LoginForm;

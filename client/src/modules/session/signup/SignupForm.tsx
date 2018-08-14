import * as React from 'react';
import styled from 'react-emotion';
import { Form, Icon, Input, Button } from 'antd';
import { compose, withState, withHandlers, withProps } from 'recompose';
import { Link } from 'react-router-dom';
import { SessionErrors } from '../';
import { signup, SessionActions } from 'data';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IAuthResponse, ISignupUser } from 'j-toker';

const { Item } = Form;

interface IInnerProps {
  form: WrappedFormUtils;
  loading: boolean;
  confirmDirty: boolean;
  errors: string[];
  signup: (user: User.ISignupUser) => IAuthResponse;
  setSession: (user: User.ISessionUser) => void;
  setConfirmDirty: (confirmDirty: boolean) => void;
  setLoading: (loading: boolean) => void;
  setErrors: (errors: string[]) => void;
  handleSignupSuccess: (res: IAuthResponse) => void;
  handleSignupError: () => void;
  doSignup: (user: User.ISignupUser) => void;
  // Antd was lazy defining the inner function here so I will be too
  checkPasswordConfirm: (form: WrappedFormUtils, otherPasswordField: string) => (rule: any, value: any, callback: any) => any;
  handleConfirmBlur: (event: React.SyntheticEvent<HTMLInputElement>) => void;
  afterValidate: (errors: string[], user: User.ISignupUser) => void;
  handleSubmit: (event: React.SyntheticEvent<HTMLElement>) => void;
}

const enhance = compose<IInnerProps, {}>(
  Form.create(),
  connect(
    null,
    dispatch => ({
      setSession: (user: User.ISessionUser) => dispatch(SessionActions.setSession(user)),
      signup: (user: ISignupUser) => dispatch(signup(user) as any)
    })
  ),
  withState('confirmDirty', 'setConfirmDirty', false),
  withState('loading', 'setLoading', false),
  withState('errors', 'setErrors', []),
  withHandlers({
    handleSignupError: (props: any) => (res: IAuthResponse) => {
      props.setLoading(false);
      props.setErrors(get(res.data.errors, 'full_messages') || ['something went wrong']);
    },
    handleSignupSuccess: (props: any) => (res: IAuthResponse) => {
      props.setLoading(false);
      props.setSession(res.data);
      window.ss.message.success(`signed in as ${res.data.name}`);
    }
  }),
  withProps((props: any) => ({
    doSignup: async (user: User.ISignupUser) => {
      props.setLoading(true);

      try {
        const response = await props.signup({
          email: user.email,
          name: user.username,
          password: user.password,
          password_confirmation: user.passwordConfirmation
        });
        props.handleSignupSuccess(response);
      } catch (error) {
        props.handleSignupError(error);
      }
    }
  })),
  withProps(() => ({
    checkPasswordConfirm: (form: WrappedFormUtils, otherPasswordField: string) => (rule: any, value: any, callback: any) => {
      const otherValue = form.getFieldValue(otherPasswordField);

      if (value && otherValue && value !== otherValue) {
        callback('passwords do not match');
      } else {
        callback();
      }
    }
  })),
  withHandlers({
    afterValidate: (props: any) => (errors?: string[], user?: User.ISignupUser) => {
      if (!errors) {
        props.doSignup(user);
      }
    },
    handleConfirmBlur: (props: any) => (event: React.FocusEvent<HTMLInputElement>) => {
      const { value } = event.target;
      props.setConfirmDirty(props.confirmDirty || !!value);
    }
  }),
  withHandlers({
    handleSubmit: (props: any) => (event: React.SyntheticEvent<HTMLElement>) => {
      event.preventDefault();
      props.form.validateFields(props.afterValidate);
    }
  })
);

const SignupButton = styled(Button)`
  width: 100%;
`;

const Footer = styled('div')`
  width: 100%;
  text-align: center;
`;

export const SignupForm = enhance(props => (
  <div>
    <Form onSubmit={props.handleSubmit}>
      <Item>
        {props.form.getFieldDecorator('username', {
          rules: [
            { required: true, message: 'username is required' },
            { min: 3, message: 'must be at least 3 characters' },
            { max: 30, message: 'must be at most 30 characters' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: 'must only contain letters, numbers, or underscores' },
            { pattern: /[a-zA-Z0-9]{1,}/, message: 'must have at least one letter or number' }
          ],
        })(
          <Input
            disabled={props.loading}
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="username"
          />
        )}
      </Item>
      <Item>
        {props.form.getFieldDecorator('email', {
          rules: [
            { type: 'email', message: 'please enter a valid email' },
            { required: true, message: 'email is required' },
            { max: 30, message: 'must be at most 30 characters' },
          ],
        })(
          <Input
            disabled={props.loading}
            prefix={<Icon type="inbox" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="email"
          />
        )}
      </Item>
      <Item>
        {props.form.getFieldDecorator('password', {
          rules: [
            { required: true, message: 'password is required' },
            { min: 6, message: 'must be at least 6 characters' },
            { max: 20, message: 'must be at most 20 characters' },
            { pattern: /^((?![<>;]).)*$/, message: 'must not contain <, >, or ;' },
            { validator: props.checkPasswordConfirm(props.form, 'passwordConfirmation') }
          ],
        })(
          <Input
            disabled={props.loading}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="password"
          />
        )}
      </Item>
      <Item>
        {props.form.getFieldDecorator('passwordConfirmation', {
          rules: [
            { required: true, message: 'confirm your password' },
            { validator: props.checkPasswordConfirm(props.form, 'password') }
          ],
        })(
          <Input
            disabled={props.loading}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="confirm password"
          />
        )}
      </Item>
      <Item>
        <SignupButton type="primary" htmlType="submit" loading={props.loading}>
          signup
        </SignupButton>
      </Item>
    </Form>
    <Footer>
      Already have an account? <Link to="/login">login</Link>
    </Footer>
    <Footer>
      <SessionErrors errors={props.errors} />
    </Footer>
  </div>
));

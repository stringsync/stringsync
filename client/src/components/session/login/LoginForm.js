import React from 'react';
import styled from 'react-emotion';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { compose, withState, withHandlers, withProps } from 'recompose';
import { Link } from 'react-router-dom';
import { SessionErrors } from '../';
import { connect } from 'react-redux';
import { login, sessionActions } from 'data';

const { Item } = Form;

const enhance = compose(
  Form.create(),
  connect(
    null,
    dispatch => ({
      login: (user, onSuccess, onError) => dispatch(login(user, onSuccess, onError)),
      setSession: user => dispatch(sessionActions.session.set(user))
    })
  ),
  withState('loading', 'setLoading', false),
  withState('errors', 'setErrors', []),
  withHandlers({
    handleLoginSuccess: props => res => {
      props.setLoading(false);
      props.setSession(res.data);
      window.ss.message.success(`signed in as ${res.data.name}`);
    },
    handleLoginError: props => res => {
      props.setLoading(false);
      props.setErrors(res.data.errors);
    }
  }),
  withProps(props => ({
    doLogin: async user => {
      props.setLoading(true);
      await props.login(user, props.handleLoginSuccess, props.handleLoginError);
    }
  })),
  withHandlers({
    afterValidate: props => (errors, user) => {
      if (!errors) {
        props.doLogin(user);
      }
    }
  }),
  withHandlers({
    handleSubmit: props => event => {
      event.preventDefault();
      props.form.validateFields(props.afterValidate);
    }
  })
);

const Outer = styled('div')`
  transition: height 500ms ease-in;
`;

const LoginButton = styled(Button) `
  width: 100%;
`;

const Footer = styled('div') `
  width: 100%;
  text-align: center;
`;

const LoginForm = enhance(props => (
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
          <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="password" />
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

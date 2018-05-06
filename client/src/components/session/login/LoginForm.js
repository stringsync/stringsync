import React from 'react';
import styled from 'react-emotion';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { compose, withState } from 'recompose';
import { Link } from 'react-router-dom';
import { SessionErrors } from '../';

const { Item } = Form;

const enhance = compose(
  Form.create(),
  withState('loading', 'setLoading', false),
  withState('errors', 'setErrors', [])
);

const Outer = styled('div')`
  transition: height 500ms ease-in;
`;

const LoginButton = styled(Button) `
  width: 100%;
`;

const ForgotLink = styled('a') `
  float: right;
`;

const LoginForm = enhance(props => (
  <Outer>
    <Form onSubmit={this.handleSubmit}>
      <Item>
        {props.form.getFieldDecorator('username', {
          rules: [{ required: true, message: 'username cannot be blank' }],
        })(
          <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="username" />
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
        {props.form.getFieldDecorator('remember', {
          valuePropName: 'checked',
          initialValue: true,
        })(
          <Checkbox>remember me</Checkbox>
        )}
        <ForgotLink href="">forgot password</ForgotLink>
        <LoginButton type="primary" htmlType="submit">
          login
        </LoginButton>
        or <Link to="/signup">register now!</Link>
      </Item>
    </Form>
    <SessionErrors errors={props.errors} />
  </Outer> 
));

export default LoginForm;

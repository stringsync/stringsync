import React from 'react';
import styled from 'react-emotion';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { compose, setDisplayName } from 'recompose';
import { Link } from 'react-router-dom';

const enhance = compose(
  Form.create(),
  setDisplayName('LoginForm')
);

const LoginButton = styled(Button) `
  width: 100%;
`;

const ForgotLink = styled('a') `
  float: right;
`;

const LoginForm = enhance(props => (
  <Form onSubmit={this.handleSubmit}>
    <Form.Item>
      {props.form.getFieldDecorator('username', {
        rules: [{ required: true, message: 'username cannot be blank' }],
      })(
        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="username" />
      )}
    </Form.Item>
    <Form.Item>
      {props.form.getFieldDecorator('password', {
        rules: [{ required: true, message: 'password cannot be blank' }],
      })(
        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="password" />
      )}
    </Form.Item>
    <Form.Item>
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
    </Form.Item>
  </Form>
));

export default LoginForm;

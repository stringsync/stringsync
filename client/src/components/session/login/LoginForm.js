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

const Footer = styled('div') `
  width: 100%;
  text-align: center;
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
        <LoginButton type="primary" htmlType="submit">
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

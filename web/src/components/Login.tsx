import { Button, Form, Input } from 'antd';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../ctx/auth';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { FormPage } from './FormPage';

const Center = styled.div`
  text-align: center;
`;

type FormValues = {
  usernameOrEmail: string;
  password: string;
};

export const Login: React.FC = () => {
  const [authState, authApi] = useAuth();
  const errors = authState.errors;
  const isAuthPending = authState.isPending;

  useEffectOnce(() => {
    authApi.clearErrors();
  });

  const [form] = Form.useForm<FormValues>();

  const login = authApi.login;
  const onFinish = useCallback(() => {
    const { usernameOrEmail, password } = form.getFieldsValue();
    login({ input: { usernameOrEmail, password } });
  }, [form, login]);

  return (
    <div data-testid="login">
      <FormPage
        wordmarked
        errors={errors}
        onErrorsClose={authApi.clearErrors}
        main={
          <Form form={form} onFinish={onFinish}>
            <Form.Item name="usernameOrEmail" rules={[{ required: true, message: 'username or email required' }]}>
              <Input autoFocus placeholder="username or email" disabled={isAuthPending} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'password is required' }]}>
              <Input.Password autoComplete="on" placeholder="password" disabled={isAuthPending} />
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit" disabled={isAuthPending} loading={isAuthPending}>
                login
              </Button>
            </Form.Item>
            <Center>
              <Link to="/forgot-password">forgot password?</Link>
            </Center>
          </Form>
        }
        footer={
          <Center>
            Don't have an account? <Link to="/signup">signup</Link>
          </Center>
        }
      />
    </div>
  );
};

export default Login;

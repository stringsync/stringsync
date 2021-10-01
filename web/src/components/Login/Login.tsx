import { Button, Form, Input, message } from 'antd';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AUTH_ACTIONS, useAuth } from '../../ctx/auth';
import { UNKNOWN_ERROR_MSG } from '../../errors';
import { toUserRole } from '../../graphql';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { PromiseStatus } from '../../util/types';
import { FormPage } from '../FormPage';
import { useLogin } from './useLogin';

const Center = styled.div`
  text-align: center;
`;

type FormValues = {
  usernameOrEmail: string;
  password: string;
};

export const Login: React.FC = () => {
  const [authState, dispatch] = useAuth();
  const errors = authState.errors;
  const isAuthPending = authState.isPending;

  const [form] = Form.useForm<FormValues>();

  const [login, promise] = useLogin();

  useEffectOnce(() => {
    dispatch(AUTH_ACTIONS.clearErrors());
  });

  const onErrorsClose: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    dispatch(AUTH_ACTIONS.clearErrors());
  };

  const onFinish = async () => {
    const { usernameOrEmail, password } = form.getFieldsValue();
    login({ input: { usernameOrEmail, password } });
  };

  useEffect(() => {
    if (promise.status === PromiseStatus.Idle) {
      return;
    }

    if (promise.status === PromiseStatus.Pending) {
      dispatch(AUTH_ACTIONS.pending());
      return;
    }

    const user = promise.result?.data?.login;
    if (promise.status === PromiseStatus.Resolved && user) {
      dispatch(
        AUTH_ACTIONS.setUser({
          user: {
            id: user.id,
            confirmedAt: user.confirmedAt,
            email: user.email,
            username: user.username,
            role: toUserRole(user.role),
          },
        })
      );
      message.success(`logged in as ${user.username}`);
      return;
    }

    const errors = promise.result?.errors?.map((error) => error.message) || [
      promise.error?.message || UNKNOWN_ERROR_MSG,
    ];
    dispatch(AUTH_ACTIONS.setErrors({ errors }));
  }, [promise, dispatch]);

  return (
    <div data-testid="login">
      <FormPage
        wordmarked
        errors={errors}
        onErrorsClose={onErrorsClose}
        main={
          <>
            <Form form={form} onFinish={onFinish}>
              <Form.Item name="usernameOrEmail" rules={[{ required: true, message: 'username or email required' }]}>
                <Input placeholder="username or email" disabled={isAuthPending} />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: 'password is required' }]}>
                <Input.Password placeholder="password" disabled={isAuthPending} />
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
          </>
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

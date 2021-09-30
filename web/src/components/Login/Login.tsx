import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../ctx/auth';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { FormPage } from '../FormPage';

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

  useEffectOnce(() => {
    dispatch(clearAuthErrors());
  });

  const onErrorsClose: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    dispatch(clearAuthErrors());
  };

  const onFinish = async () => {
    const { usernameOrEmail, password } = form.getFieldsValue();
    const action = await dispatch(login({ input: { usernameOrEmail, password } }));
    if (action.payload && 'user' in action.payload) {
      message.success(`logged in as ${action.payload.user.username}`);
    }
  };

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

import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FormPage } from '../../components/FormPage';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, login } from '../../store';

const Center = styled.div`
  text-align: center;
`;

export const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [form] = Form.useForm();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const isAuthPending = useSelector<RootState, boolean>((state) => state.auth.isPending);

  const onUsernameOrEmailChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsernameOrEmail(event.currentTarget.value);
    },
    [setUsernameOrEmail]
  );
  const onPasswordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.currentTarget.value);
    },
    [setPassword]
  );
  const onFinish = useCallback(() => {
    dispatch(login({ usernameOrEmail, password }));
  }, [dispatch, password, usernameOrEmail]);

  return (
    <div data-testid="signup">
      <FormPage
        wordmarked
        main={
          <>
            <Form form={form} onFinish={onFinish}>
              <Form.Item name="username-or-email">
                <Input
                  placeholder="username or email"
                  value={usernameOrEmail}
                  onChange={onUsernameOrEmailChange}
                  disabled={isAuthPending}
                />
              </Form.Item>
              <Form.Item name="password">
                <Input.Password
                  placeholder="username or email"
                  value={password}
                  onChange={onPasswordChange}
                  disabled={isAuthPending}
                />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit" disabled={isAuthPending}>
                  login
                </Button>
              </Form.Item>
            </Form>
          </>
        }
        footer={
          <Center>
            Don't have an account? <Link to="signup">signup</Link>
          </Center>
        }
      />
    </div>
  );
};

export default Login;

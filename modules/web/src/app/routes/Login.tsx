import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FormPage } from '../../components/FormPage';
import { Form, Input, Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, login, clearAuthErrors } from '../../store';

const Center = styled.div`
  text-align: center;
`;

export const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const errors = useSelector<RootState, string[]>((state) => state.auth.errors);
  const isAuthPending = useSelector<RootState, boolean>((state) => state.auth.isPending);

  const [form] = Form.useForm();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const onUsernameOrEmailChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setUsernameOrEmail(event.currentTarget.value);
    },
    [setUsernameOrEmail]
  );
  const onPasswordChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setPassword(event.currentTarget.value);
    },
    [setPassword]
  );
  const onErrorsClose = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      dispatch(clearAuthErrors());
    },
    [dispatch]
  );
  const onFinish = useCallback(async () => {
    const action = await dispatch(login({ usernameOrEmail, password }));
    if (action.payload && 'user' in action.payload) {
      message.success(`logged in as ${action.payload.user.username}`);
    }
  }, [dispatch, password, usernameOrEmail]);

  return (
    <div data-testid="signup">
      <FormPage
        wordmarked
        errors={errors}
        onErrorsClose={onErrorsClose}
        main={
          <>
            <Form form={form} onFinish={onFinish}>
              <Form.Item name="username-or-email">
                <Input placeholder="username or email" value={usernameOrEmail} onChange={onUsernameOrEmailChange} />
              </Form.Item>
              <Form.Item name="password">
                <Input.Password placeholder="password" value={password} onChange={onPasswordChange} />
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

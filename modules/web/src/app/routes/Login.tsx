import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FormPage } from '../../components/FormPage';
import { useEffectOnce } from '../../hooks';
import { AppDispatch, clearAuthErrors, login, RootState } from '../../store';

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

  useEffectOnce(() => {
    dispatch(clearAuthErrors());
  });

  const onUsernameOrEmailChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setUsernameOrEmail(event.currentTarget.value);
  };

  const onPasswordChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onErrorsClose: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    dispatch(clearAuthErrors());
  };

  const onFinish = async () => {
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
              <Form.Item name="username-or-email" rules={[{ required: true, message: 'username or email required' }]}>
                <Input placeholder="username or email" value={usernameOrEmail} onChange={onUsernameOrEmailChange} />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: 'password is required' }]}>
                <Input.Password placeholder="password" value={password} onChange={onPasswordChange} />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit" disabled={isAuthPending}>
                  login
                </Button>
              </Form.Item>
              <Center>
                <Link to="forgot-password">Forgot password?</Link>
              </Center>
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

import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FormPage } from '../../components/FormPage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, signup } from '../../store';
import { Form, Input, Button, message } from 'antd';

const Center = styled.div`
  text-align: center;
`;

const Signup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthPending = useSelector<RootState, boolean>((state) => state.auth.isPending);

  const [form] = Form.useForm();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onUsernameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.currentTarget.value);
    },
    [setUsername]
  );
  const onEmailChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.currentTarget.value);
    },
    [setEmail]
  );
  const onPasswordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.currentTarget.value);
    },
    [setPassword]
  );
  const onFinish = useCallback(async () => {
    const action = await dispatch(signup({ username, password, email }));
    if (action.payload && 'user' in action.payload) {
      message.success(`logged in as ${action.payload.user.username}`);
    }
  }, [dispatch, email, password, username]);

  return (
    <div data-testid="signup">
      <FormPage
        wordmarked
        main={
          <>
            <Form form={form} onFinish={onFinish}>
              <Form.Item name="username">
                <Input placeholder="username" value={username} onChange={onUsernameChange} />
              </Form.Item>
              <Form.Item name="email">
                <Input placeholder="email" value={email} onChange={onEmailChange} />
              </Form.Item>
              <Form.Item name="password">
                <Input.Password placeholder="password" value={password} onChange={onPasswordChange} />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit" disabled={isAuthPending}>
                  signup
                </Button>
              </Form.Item>
            </Form>
          </>
        }
        footer={
          <Center>
            Have an account? <Link to="login">login</Link>
          </Center>
        }
      />
    </div>
  );
};

export default Signup;

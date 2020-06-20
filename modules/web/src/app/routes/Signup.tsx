import React, { useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FormPage } from '../../components/FormPage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, signup, clearAuthErrors } from '../../store';
import { Form, Input, Button, message } from 'antd';
import { useEffectOnce } from '../../hooks';
import { Rule } from 'antd/lib/form';
import { ClientsContext } from '../../clients';

const usernameRules: Rule[] = [
  { required: true, message: 'username is required' },
  { pattern: /^[a-zA-Z0-9_-]*$/, message: 'username must only contain letters, numbers, dashes, and underscores' },
  { min: 3, message: 'username must be at least 3 characeters' },
  { max: 36, message: 'username must be at most 36 characeters' },
];

const emailRules: Rule[] = [
  { required: true, message: 'email is required' },
  { type: 'email', message: 'email must be valid' },
  { max: 36, message: 'email must be at most 36 characeters' },
];

const passwordRules: Rule[] = [
  { required: true, message: 'password is required' },
  { min: 8, message: 'password must be at least 8 characeters' },
  { max: 256, message: 'password must be at most 256 characeters' },
];

const Center = styled.div`
  text-align: center;
`;

const Signup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const clients = useContext(ClientsContext);
  const errors = useSelector<RootState, string[]>((state) => state.auth.errors);
  const isAuthPending = useSelector<RootState, boolean>((state) => state.auth.isPending);

  const [form] = Form.useForm();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffectOnce(() => {
    dispatch(clearAuthErrors());
  });

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
  const onErrorsClose = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      dispatch(clearAuthErrors());
    },
    [dispatch]
  );
  const onFinish = useCallback(async () => {
    const action = await dispatch(signup({ authClient: clients.authClient, input: { username, password, email } }));
    if (action.payload && 'user' in action.payload) {
      message.success(`logged in as ${action.payload.user.username}`);
    }
  }, [clients.authClient, dispatch, email, password, username]);

  return (
    <div data-testid="signup">
      <FormPage
        wordmarked
        errors={errors}
        onErrorsClose={onErrorsClose}
        main={
          <>
            <Form form={form} onFinish={onFinish}>
              <Form.Item hasFeedback name="username" rules={usernameRules}>
                <Input placeholder="username" value={username} onChange={onUsernameChange} />
              </Form.Item>
              <Form.Item hasFeedback name="email" rules={emailRules}>
                <Input placeholder="email" value={email} onChange={onEmailChange} />
              </Form.Item>
              <Form.Item hasFeedback name="password" rules={passwordRules}>
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

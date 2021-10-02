import { Button, Form, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../ctx/auth';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { FormPage } from '../FormPage';

const USERNAME_RULES: Rule[] = [
  { required: true, message: 'username is required' },
  { pattern: /^[a-zA-Z0-9_-]*$/, message: 'username must only contain letters, numbers, dashes, and underscores' },
  { min: 3, message: 'username must be at least 3 characeters' },
  { max: 36, message: 'username must be at most 36 characeters' },
];

const EMAIL_RULES: Rule[] = [
  { required: true, message: 'email is required' },
  { type: 'email', message: 'email must be valid' },
  { max: 36, message: 'email must be at most 36 characeters' },
];

const PASSWORD_RULES: Rule[] = [
  { required: true, message: 'password is required' },
  { min: 8, message: 'password must be at least 8 characeters' },
  { max: 256, message: 'password must be at most 256 characeters' },
];

const Center = styled.div`
  text-align: center;
`;

type FormValues = {
  username: string;
  email: string;
  password: string;
};

const Signup: React.FC = () => {
  const [authState, authApi] = useAuth();
  const authErrors = authState.errors;
  const isAuthPending = authState.isPending;

  const [form] = Form.useForm<FormValues>();

  useEffectOnce(() => {
    authApi.clearErrors();
  });

  const onErrorsClose: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    authApi.clearErrors();
  };
  const onFinish = () => {
    const { username, password, email } = form.getFieldsValue();
    authApi.signup({ input: { username, password, email } });
  };

  return (
    <div data-testid="signup">
      <FormPage
        wordmarked
        errors={authErrors}
        onErrorsClose={onErrorsClose}
        main={
          <>
            <Form form={form} onFinish={onFinish}>
              <Form.Item hasFeedback name="username" rules={USERNAME_RULES}>
                <Input placeholder="username" disabled={isAuthPending} />
              </Form.Item>
              <Form.Item hasFeedback name="email" rules={EMAIL_RULES}>
                <Input placeholder="email" disabled={isAuthPending} />
              </Form.Item>
              <Form.Item hasFeedback name="password" rules={PASSWORD_RULES}>
                <Input.Password placeholder="password" disabled={isAuthPending} />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit" disabled={isAuthPending} loading={isAuthPending}>
                  signup
                </Button>
              </Form.Item>
            </Form>
          </>
        }
        footer={
          <Center>
            Have an account? <Link to="/login">login</Link>
          </Center>
        }
      />
    </div>
  );
};

export default Signup;

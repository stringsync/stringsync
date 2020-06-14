import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FormPage } from '../../components/FormPage';
import { Wordmark } from '../../components/Wordmark';
import { Form, Input, Button } from 'antd';

const Center = styled.div`
  text-align: center;
`;

const StyledH1 = styled.h1`
  text-align: center;
  font-size: 32px;
`;

export const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    <div data-testid="signup">
      <FormPage
        main={
          <>
            <StyledH1>
              <Wordmark></Wordmark>
            </StyledH1>
            <Form form={form}>
              <Form.Item name="username-or-email">
                <Input placeholder="username or email" value={usernameOrEmail} onChange={onUsernameOrEmailChange} />
              </Form.Item>
              <Form.Item name="password">
                <Input.Password placeholder="username or email" value={password} onChange={onPasswordChange} />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit">
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

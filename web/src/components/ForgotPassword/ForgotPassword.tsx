import { Button, Form, Input, message } from 'antd';
import { Rule } from 'antd/lib/form';
import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AUTH_ACTIONS, useAuth } from '../../ctx/auth';
import { PromiseStatus } from '../../util/types';
import { FormPage } from '../FormPage';
import { useSendResetPasswordEmail } from './useSendResetPasswordEmail';

const EMAIL_RULES: Rule[] = [
  { required: true, message: 'email is required' },
  { type: 'email', message: 'email must be valid' },
];

const Center = styled.div`
  text-align: center;
`;

type FormValues = {
  email: string;
};

export const ForgotPassword: React.FC = () => {
  const [authState, dispatch] = useAuth();
  const isAuthPending = authState.isPending;
  const errors = authState.errors;
  const history = useHistory();

  const [form] = Form.useForm<FormValues>();

  const onErrorsClose: React.MouseEventHandler<HTMLButtonElement> = () => {
    dispatch(AUTH_ACTIONS.clearErrors());
  };

  const [sendResetPasswordEmail, promise] = useSendResetPasswordEmail();

  const { email } = form.getFieldsValue();

  const onFinish = () => {
    sendResetPasswordEmail({ input: { email } });
  };

  useEffect(() => {
    if (promise.status === PromiseStatus.Idle) {
      return;
    }
    if (promise.status === PromiseStatus.Pending) {
      return;
    }
    if (promise.status === PromiseStatus.Resolved && promise.result?.data) {
      message.success(`sent reset password email to ${email}`);
      history.push(`/reset-password?email=${email}`);
      return;
    }

    console.error(`something went wrong sending reset password: ${promise.error}`);
    message.error('something went wrong');
  }, [promise, email, history]);

  return (
    <div data-testid="forgot-password">
      <FormPage
        wordmarked
        errors={errors}
        onErrorsClose={onErrorsClose}
        main={
          <>
            <Form form={form} onFinish={onFinish}>
              <Form.Item name="email" rules={EMAIL_RULES}>
                <Input placeholder="email" />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit" disabled={isAuthPending}>
                  send password reset link
                </Button>
              </Form.Item>
            </Form>
          </>
        }
        footer={
          <Center>
            Remember your password? <Link to="/login">login</Link>
          </Center>
        }
      />
    </div>
  );
};

export default ForgotPassword;

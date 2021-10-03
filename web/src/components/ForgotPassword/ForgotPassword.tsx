import { Button, Form, Input, message } from 'antd';
import { Rule } from 'antd/lib/form';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../ctx/auth';
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
  const [authState, authApi] = useAuth();
  const isAuthPending = authState.isPending;
  const errors = authState.errors;
  const history = useHistory();

  const [form] = Form.useForm<FormValues>();

  const onErrorsClose: React.MouseEventHandler<HTMLButtonElement> = () => {
    authApi.clearErrors();
  };

  const sendResetPasswordEmail = useSendResetPasswordEmail({
    onSuccess: (res) => {
      const { email } = form.getFieldsValue();
      if (res.data?.sendResetPasswordEmail) {
        message.success(`sent reset password email to ${email}`);
        history.push(`/reset-password?email=${email}`);
      } else {
        message.error('something went wrong');
      }
    },
    onError: (error) => {
      message.error('something went wrong');
    },
  });

  const onFinish = () => {
    const { email } = form.getFieldsValue();
    sendResetPasswordEmail({ input: { email } });
  };

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

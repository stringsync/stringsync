import { Button, Form, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { notify } from '../../lib/notify';
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
  const navigate = useNavigate();

  const [form] = Form.useForm<FormValues>();

  const sendResetPasswordEmail = useSendResetPasswordEmail({
    onData: () => {
      const { email } = form.getFieldsValue();
      notify.message.success({ content: `sent reset password email to ${email}` });
      navigate(`/reset-password?email=${email}`);
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
        main={
          <>
            <Form form={form} onFinish={onFinish}>
              <Form.Item name="email" rules={EMAIL_RULES}>
                <Input autoFocus placeholder="email" />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit">
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

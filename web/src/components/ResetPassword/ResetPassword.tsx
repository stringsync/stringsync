import { Button, Form, Input, message } from 'antd';
import { Rule } from 'antd/lib/form';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UNKNOWN_ERROR_MSG } from '../../errors';
import { FormPage } from '../FormPage';
import { useResetPassword } from './useResetPassword';

const EMAIL_RULES: Rule[] = [
  { required: true, message: 'email is required' },
  { type: 'email', message: 'email must be valid' },
];

const RESET_PASSWORD_TOKEN_RULES: Rule[] = [{ required: true, message: 'reset password token is required' }];

const PASSWORD_RULES: Rule[] = [
  { required: true, message: 'password is required' },
  { min: 8, message: 'password must be at least 8 characeters' },
  { max: 256, message: 'password must be at most 256 characeters' },
];

const Center = styled.div`
  text-align: center;
`;

type FormValues = {
  email: string;
  resetPasswordToken: string;
  password: string;
};

export const ResetPassword: React.FC = (props) => {
  const location = useLocation();
  const history = useHistory();

  const [errors, setErrors] = useState(new Array<string>());
  const [form] = Form.useForm<FormValues>();

  const { execute: resetPassword, loading } = useResetPassword({
    beforeLoading: () => {
      setErrors([]);
    },
    onData: (data) => {
      if (data.resetPassword) {
        message.success('password successfully reset');
        history.push('/login');
      } else {
        setErrors([UNKNOWN_ERROR_MSG]);
      }
    },
    onErrors: (errors) => {
      setErrors(errors);
    },
  });

  const onErrorsClose = () => {
    setErrors([]);
  };

  const onFinish = async () => {
    const { email, password, resetPasswordToken } = form.getFieldsValue();
    resetPassword({ input: { email, password, resetPasswordToken } });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const queryParamsEmail = queryParams.get('email');
    if (queryParamsEmail) {
      form.setFieldsValue({ email: queryParamsEmail });
    }

    const queryParamsResetPasswordToken = queryParams.get('reset-password-token');
    if (queryParamsResetPasswordToken) {
      form.setFieldsValue({ resetPasswordToken: queryParamsResetPasswordToken });
    }
  }, [form, location.search]);

  return (
    <div data-testid="reset-password">
      <FormPage
        wordmarked
        errors={errors}
        onErrorsClose={onErrorsClose}
        main={
          <>
            <Form form={form} onFinish={onFinish}>
              <Form.Item hasFeedback name="email" rules={EMAIL_RULES}>
                <Input autoFocus placeholder="email" />
              </Form.Item>
              <Form.Item hasFeedback name="resetPasswordToken" rules={RESET_PASSWORD_TOKEN_RULES}>
                <Input placeholder="reset password token" />
              </Form.Item>
              <Form.Item hasFeedback name="password" rules={PASSWORD_RULES}>
                <Input.Password placeholder="new password" />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit" disabled={loading}>
                  reset password
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

export default ResetPassword;

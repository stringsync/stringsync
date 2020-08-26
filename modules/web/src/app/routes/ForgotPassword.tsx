import { Button, Form, Input, message } from 'antd';
import { Rule } from 'antd/lib/form';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { FormPage } from '../../components/FormPage';
import { AppDispatch, clearAuthErrors, RootState, sendResetPasswordEmail } from '../../store';

const EMAIL_RULES: Rule[] = [
  { required: true, message: 'email is required' },
  { type: 'email', message: 'email must be valid' },
];

const Center = styled.div`
  text-align: center;
`;

export const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const errors = useSelector<RootState, string[]>((state) => state.auth.errors);
  const isAuthPending = useSelector<RootState, boolean>((state) => state.auth.isPending);
  const returnToRoute = useSelector<RootState, string>((state) => state.history.returnToRoute);
  const history = useHistory();

  const [form] = Form.useForm();

  const [email, setEmail] = useState('');

  const onEmailChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onErrorsClose: React.MouseEventHandler<HTMLButtonElement> = () => {
    dispatch(clearAuthErrors());
  };

  const onFinish = async () => {
    const action = await dispatch(sendResetPasswordEmail({ input: { email } }));
    const maybeSendResetPasswordEmailRes = action.payload; // boolean | { errors: string [] }
    if (maybeSendResetPasswordEmailRes === true) {
      message.success(`sent reset password email to ${email}`);
      history.push(returnToRoute);
    }
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
                <Input placeholder="email" value={email} onChange={onEmailChange} />
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
            Remember your password? <Link to="login">login</Link>
          </Center>
        }
      />
    </div>
  );
};

export default ForgotPassword;

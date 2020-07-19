import { Button, Form, Input } from 'antd';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FormPage } from '../../components/FormPage';
import { RootState } from '../../store';
import { Rule } from 'antd/lib/form';

const EMAIL_RULES: Rule[] = [
  { required: true, message: 'email is required' },
  { type: 'email', message: 'email must be valid' },
  { max: 36, message: 'email must be at most 36 characeters' },
];

const Center = styled.div`
  text-align: center;
`;

export const ReqPasswordReset: React.FC = () => {
  const errors = useSelector<RootState, string[]>((state) => state.auth.errors);
  const isAuthPending = useSelector<RootState, boolean>((state) => state.auth.isPending);

  const [form] = Form.useForm();

  const [email, setEmail] = useState('');

  const onEmailChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setEmail(event.currentTarget.value);
  }, []);

  return (
    <div data-testid="req-password-reset">
      <FormPage
        wordmarked
        errors={errors}
        onErrorsClose={() => undefined}
        main={
          <>
            <Form form={form}>
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

export default ReqPasswordReset;

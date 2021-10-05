import { Button, Divider, Form, Input, message } from 'antd';
import { Rule } from 'antd/lib/form';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../ctx/auth';
import { UNKNOWN_ERROR_MSG } from '../../errors';
import { Layout, withLayout } from '../../hocs/withLayout';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { useQueryParams } from '../../hooks/useQueryParams';
import { compose } from '../../util/compose';
import { FormPage } from '../FormPage';
import { useConfirmEmail } from './useConfirmEmail';
import { useResendConfirmationToken } from './useResendConfirmationToken';

const CONFIRMATION_TOKEN_RULES: Rule[] = [{ required: true, message: 'confirmation token is required' }];

const enhance = compose(withLayout(Layout.NONE));

type FormValues = {
  confirmationToken: string;
};

export const ConfirmEmail: React.FC = enhance(() => {
  const [authState] = useAuth();
  const email = authState.user.email;
  const confirmedAt = authState.user.confirmedAt;

  const [errors, setErrors] = useState(new Array<string>());
  const [form] = Form.useForm<FormValues>();
  const history = useHistory();
  const queryParams = useQueryParams();

  const { execute: confirmEmail, loading: confirmEmailLoading } = useConfirmEmail({
    beforeLoading: () => {
      setErrors([]);
    },
    onData: (data) => {
      if (data.confirmEmail?.confirmedAt) {
        message.success(`${email} confirmed`);
        history.push('/library');
      } else {
        setErrors([UNKNOWN_ERROR_MSG]);
      }
    },
    onErrors: (errors) => {
      setErrors(errors);
    },
  });

  const { execute: resendConfirmationToken, loading: resendConfirmationTokenLoading } = useResendConfirmationToken({
    beforeLoading: () => {
      setErrors([]);
    },
    onData: (data) => {
      if (data?.resendConfirmationEmail) {
        message.success(`sent confirmation token to ${email}`);
      } else {
        setErrors([UNKNOWN_ERROR_MSG]);
      }
    },
    onErrors: (errors) => {
      setErrors(errors);
    },
  });

  const loading = confirmEmailLoading || resendConfirmationTokenLoading;

  const onErrorsClose = () => {
    setErrors([]);
  };

  const onFinish = async () => {
    const { confirmationToken } = form.getFieldsValue();
    confirmEmail({ input: { confirmationToken } });
  };

  const onResendConfirmationTokenClick = async () => {
    resendConfirmationToken();
  };

  useEffectOnce(() => {
    if (confirmedAt) {
      message.warn(`${email} is already confirmed`);
      history.push('/library');
    }
  });

  useEffect(() => {
    const confirmationToken = queryParams.get('confirmationToken');
    if (confirmationToken) {
      form.setFieldsValue({ confirmationToken });
    }
  }, [form, queryParams]);

  return (
    <div data-testid="confirm-email">
      <FormPage
        wordmarked
        errors={errors}
        onErrorsClose={onErrorsClose}
        main={
          <>
            <Form form={form} onFinish={onFinish}>
              <Form.Item>
                <Input autoFocus placeholder="email" disabled value={email} />
              </Form.Item>
              <Form.Item hasFeedback name="confirmationToken" rules={CONFIRMATION_TOKEN_RULES}>
                <Input placeholder="confirmation token" />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit" disabled={loading}>
                  confirm email
                </Button>
              </Form.Item>

              <Divider>or</Divider>

              <Button block type="link" onClick={onResendConfirmationTokenClick} disabled={loading}>
                resend confirmation token
              </Button>
            </Form>
          </>
        }
      />
    </div>
  );
});

export default ConfirmEmail;

import { Button, Divider, Form, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../ctx/auth';
import { Layout, withLayout } from '../hocs/withLayout';
import { useConfirmEmail } from '../hooks/useConfirmEmail';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { GqlStatus } from '../hooks/useGql';
import { useGqlHandler } from '../hooks/useGqlHandler';
import { useQueryParams } from '../hooks/useQueryParams';
import { useResendConfirmationToken } from '../hooks/useResendConfirmationToken';
import { UNKNOWN_ERROR_MSG } from '../lib/errors';
import { notify } from '../lib/notify';
import { compose } from '../util/compose';
import { FormPage } from './FormPage';

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
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  const [confirmEmail, confirmEmailRes] = useConfirmEmail();
  useGqlHandler
    .onPending(confirmEmailRes, () => {
      setErrors([]);
    })
    .onSuccess(confirmEmailRes, ({ data }) => {
      switch (data.confirmEmail?.__typename) {
        case 'EmailConfirmation':
          notify.message.success({ content: `${email} confirmed` });
          navigate('/library');
          break;
        case 'BadRequestError':
        case 'ForbiddenError':
        case 'NotFoundError':
        case 'UnknownError':
          setErrors([data.confirmEmail.message]);
          break;
        default:
          setErrors([UNKNOWN_ERROR_MSG]);
      }
    });

  const [resendConfirmationToken, resendConfirmationTokenRes] = useResendConfirmationToken();
  useGqlHandler
    .onPending(resendConfirmationTokenRes, () => {
      setErrors([]);
    })
    .onSuccess(resendConfirmationTokenRes, ({ data }) => {
      switch (data.resendConfirmationEmail?.__typename) {
        case 'Processed':
          notify.message.success({ content: `sent confirmation token to ${email}` });
          break;
        case 'ForbiddenError':
          setErrors([data.resendConfirmationEmail.message]);
          break;
        default:
          setErrors([UNKNOWN_ERROR_MSG]);
      }
    });

  const loading =
    confirmEmailRes.status === GqlStatus.Pending || resendConfirmationTokenRes.status === GqlStatus.Pending;

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
      notify.message.warn({ content: `${email} is already confirmed` });
      navigate('/library');
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

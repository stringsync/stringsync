import { Button, Divider, Form, Input, message } from 'antd';
import { Rule } from 'antd/lib/form';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { UnknownError, UNKNOWN_ERROR_MSG } from '../../errors';
import { $queries } from '../../graphql';
import { Layout, withLayout } from '../../hocs/withLayout';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { useQueryParams } from '../../hooks/useQueryParams';
import { RootState } from '../../store';
import { compose } from '../../util/compose';
import { FormPage } from '../FormPage';

const CONFIRMATION_TOKEN_RULES: Rule[] = [{ required: true, message: 'confirmation token is required' }];

const enhance = compose(withLayout(Layout.NONE));

type FormValues = {
  confirmationToken: string;
};

export const ConfirmEmail: React.FC = enhance(() => {
  const isAuthPending = useSelector<RootState, boolean>((state) => state.auth.isPending);
  const email = useSelector<RootState, string>((state) => state.auth.user.email);
  const confirmedAt = useSelector<RootState, string | null>((state) => state.auth.user.confirmedAt);

  const [errors, setErrors] = useState(new Array<string>());
  const [isPending, setIsPending] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const history = useHistory();
  const queryParams = useQueryParams();
  const disabled = isPending || isAuthPending;

  const onErrorsClose = () => {
    setErrors([]);
  };

  const onFinish = async () => {
    setIsPending(true);
    setErrors([]);

    try {
      const { confirmationToken } = form.getFieldsValue();
      const { data, errors } = await $queries.confirmEmail({ confirmationToken });
      if (errors) {
        setErrors(errors.map((error) => error.message));
        return;
      }
      if (!data) {
        throw new UnknownError();
      }
      if (data.confirmEmail && data.confirmEmail.confirmedAt) {
        message.success(`${email} confirmed`);
        history.push('/library');
      }
    } catch (e) {
      console.error(e);
      setErrors([UNKNOWN_ERROR_MSG]);
    } finally {
      setIsPending(false);
    }
  };

  const onResendConfirmationTokenClick = async () => {
    setIsPending(true);
    setErrors([]);

    try {
      const { data, errors } = await $queries.resendConfirmationEmail();
      if (errors) {
        setErrors(errors.map((error) => error.message));
        return;
      }
      if (!data) {
        throw new UnknownError();
      }
      message.success(`sent confirmation token to ${email}`);
    } catch (e) {
      console.error(e);
      setErrors([UNKNOWN_ERROR_MSG]);
    } finally {
      setIsPending(false);
    }
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
                <Input placeholder="email" disabled value={email} />
              </Form.Item>
              <Form.Item hasFeedback name="confirmationToken" rules={CONFIRMATION_TOKEN_RULES}>
                <Input placeholder="confirmation token" />
              </Form.Item>
              <Form.Item>
                <Button block type="primary" htmlType="submit" disabled={disabled}>
                  confirm email
                </Button>
              </Form.Item>

              <Divider>or</Divider>

              <Button block type="link" onClick={onResendConfirmationTokenClick} disabled={disabled}>
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

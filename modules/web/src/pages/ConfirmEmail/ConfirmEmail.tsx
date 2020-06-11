import React, { useState, useCallback, useEffect } from 'react';
import { compose } from '../../common';
import { withLayout, Layouts } from '../../hocs';
import { useLocation } from 'react-router';
// import { EMAIL_CONF_TOKEN_QUERY_PARAM_NAME } from '../../common';
import { useSelector } from '../../hooks';
import { getErrorMessages } from '../../util';
import { Button, message, Row, Col, Alert } from 'antd';
import styled from 'styled-components';
import { useHistory } from 'react-router';

const SPANS = Object.freeze({
  xs: 18,
  sm: 16,
  md: 8,
  lg: 7,
  xl: 6,
  xxl: 6,
});

const RoundedBox = styled.div`
  margin: 0 auto;
  margin-top: 24px;
  background: white;
  border: 1px solid ${(props) => props.theme['@border-color']};
  border-radius: 4px;
  padding: 24px;
  max-width: 320px;
`;

const StyledAlert = styled(Alert)`
  width: 100%;
  max-width: 320px;

  && {
    margin: 0 auto;
    margin-top: 24px;
  }
`;

const StyledUl = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Message = styled.h4`
  color: ${(props) => props.theme['@muted']};
  text-align: center;
  margin: 0 16px 24px 16px;
  font-weight: 300;
`;

const enhance = compose(withLayout(Layouts.DEFAULT));

const ConfirmEmail = enhance(() => {
  const isAuthPending = useSelector((state) => state.auth.isPending);
  const isConfirmed = useSelector((state) => !!state.auth.user.confirmedAt);
  const email = useSelector((state) => state.auth.user.email);
  // const dispatch = useDispatch();
  // const client = useClient();
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState(new Array<string>());
  const clearErrors = useCallback(() => setErrors([]), [setErrors]);
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  console.log(params);
  // const confirmationToken = params.get(EMAIL_CONF_TOKEN_QUERY_PARAM_NAME) || '';

  const confirmEmail = useCallback(async () => {
    setLoading(true);
    clearErrors();
    try {
      // const res = await client.call<
      //   ConfirmEmailData,
      //   InputOf<ConfirmEmailInput>
      // >(CONFIRM_EMAIL_MUTATION, { input: { confirmationToken } });
      // dispatch(confirmEmailAction(res.user.confirmedAt));
    } catch (error) {
      const errorMessages = getErrorMessages(error);
      setErrors(errorMessages);
    }
    setLoading(false);
  }, [clearErrors]);

  const resendConfirmationEmail = useCallback(async () => {
    setLoading(true);
    try {
      // await client.call<
      //   ResendConfirmationData,
      //   InputOf<ResendConfirmationInput>
      // >(RESEND_CONFIRMATION_MUTATION, { input: { email } });
      message.info('resent confirmation email');
      history.push('library');
    } catch (error) {
      const errorMessages = getErrorMessages(error);
      setErrors(errorMessages);
    }
    setLoading(false);
  }, [history]);

  useEffect(() => {
    if (isConfirmed) {
      message.success('email confirmed');
      history.push('library');
    }
  }, [history, isConfirmed]);

  return (
    <div data-testid="confirm-email">
      <Row justify="center" align="middle">
        <Col {...SPANS}>
          <RoundedBox>
            <Message>Confirm {email} to gain access to exclusive features</Message>
            {errors.length ? (
              <Button
                block
                disabled={isAuthPending}
                type="primary"
                onClick={resendConfirmationEmail}
                loading={isLoading}
              >
                Resend Confirmation Email
              </Button>
            ) : (
              <Button block disabled={isAuthPending} type="default" onClick={confirmEmail} loading={isLoading}>
                Confirm Email
              </Button>
            )}
          </RoundedBox>
        </Col>
      </Row>

      {errors.length ? (
        <Row justify="center" align="middle">
          <Col {...SPANS}>
            <StyledAlert
              closable
              type="error"
              showIcon
              onClose={clearErrors}
              message="Error"
              description={
                <StyledUl>
                  {errors.map((error, errorNdx) => {
                    return <li key={errorNdx}>{error}</li>;
                  })}
                </StyledUl>
              }
            ></StyledAlert>
          </Col>
        </Row>
      ) : null}
    </div>
  );
});

export default ConfirmEmail;

import React, { FormEventHandler } from 'react';
import { Form, Input, Row, Col, Button, Alert } from 'antd';
import styled from 'styled-components';
import { FormComponentProps } from 'antd/lib/form';
import { Link } from 'react-router-dom';
import { Wordmark } from '../../components/wordmark';
import { useDispatch } from 'react-redux';
import { compose } from '../../common';
import { withLayout } from '../../hocs';
import { Layouts } from '../../hocs/with-layout/Layouts';
import { useEffectOnce, useSelector } from '../../hooks';
import { signup, clearAuthErrors } from '../../store';

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

const StyledH1 = styled.h1`
  text-align: center;
  font-size: 32px;
`;

const Callout = styled.h4`
  color: ${(props) => props.theme['@muted']};
  text-align: center;
  margin: 0 16px 24px 16px;
  font-weight: 300;
`;

const Legal = styled.div`
  text-align: center;
  font-weight: 300;
  color: ${(props) => props.theme['@muted']};
  margin: 0 16px 24px 16px;
`;

const TermsLink = styled(Link)`
  font-weight: 600;
  color: ${(props) => props.theme['@muted']};
`;

const LoginLink = styled.div`
  text-align: center;
`;

const SPANS = Object.freeze({
  xs: 18,
  sm: 16,
  md: 8,
  lg: 7,
  xl: 6,
  xxl: 5,
});

interface Props extends FormComponentProps {}

interface FormValues {
  email: string;
  username: string;
  password: string;
}

const enhance = compose(
  withLayout(Layouts.NONE),
  Form.create<Props>({ name: 'signup' })
);

const Signup = enhance((props: Props) => {
  const dispatch = useDispatch();
  const { isAuthPending, authErrors } = useSelector((state) => ({
    isAuthPending: state.auth.isPending,
    authErrors: state.auth.errors,
  }));

  const validateThenSignup: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    props.form.validateFields((errors, user: FormValues) => {
      if (errors) {
        console.error(errors);
        return;
      }
      dispatch(signup(user));
    });
  };
  const clearErrors = () => {
    dispatch(clearAuthErrors());
  };
  useEffectOnce(() => {
    clearErrors();
  });

  const { getFieldDecorator } = props.form;
  const emailFieldDecorator = getFieldDecorator('email', {
    rules: [{ required: true, message: 'email is required' }],
  });
  const usernameFieldDecorator = getFieldDecorator('username', {
    rules: [{ required: true, message: 'username is required' }],
  });
  const passwordFieldDecorator = getFieldDecorator('password', {
    rules: [{ required: true, message: 'password is required' }],
  });

  return (
    <div data-testid="signup">
      <Row type="flex" justify="center" align="middle">
        <Col {...SPANS}>
          <RoundedBox>
            <Link to="/library">
              <StyledH1>
                <Wordmark />
              </StyledH1>
            </Link>
            <Callout>Signup to gain access to exclusive features</Callout>
            <Form onSubmit={validateThenSignup}>
              <Form.Item>
                {emailFieldDecorator(
                  <Input
                    placeholder="email"
                    name="email"
                    disabled={isAuthPending}
                  />
                )}
              </Form.Item>
              <Form.Item>
                {usernameFieldDecorator(
                  <Input
                    placeholder="username"
                    name="username"
                    disabled={isAuthPending}
                  />
                )}
              </Form.Item>
              <Form.Item>
                {passwordFieldDecorator(
                  <Input.Password
                    placeholder="password"
                    name="password"
                    disabled={isAuthPending}
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  disabled={isAuthPending}
                >
                  signup
                </Button>
              </Form.Item>
            </Form>
            <Legal>
              By signing up, you agree to our{' '}
              <TermsLink to="terms">terms</TermsLink>
            </Legal>
          </RoundedBox>
        </Col>
      </Row>

      {authErrors.length ? (
        <Row type="flex" justify="center" align="middle">
          <Col {...SPANS}>
            <StyledAlert
              closable
              type="error"
              showIcon
              onClose={clearErrors}
              message="Error"
              description={
                <StyledUl>
                  {authErrors.map((authError, authErrorNdx) => {
                    return <li key={authErrorNdx}>{authError}</li>;
                  })}
                </StyledUl>
              }
            />
          </Col>
        </Row>
      ) : null}

      <Row type="flex" justify="center" align="middle">
        <Col {...SPANS}>
          <RoundedBox>
            <LoginLink>
              Have an account? <Link to="login">login</Link>
            </LoginLink>
          </RoundedBox>
        </Col>
      </Row>
    </div>
  );
});

export default Signup;

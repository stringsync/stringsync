import React, { FormEventHandler, MouseEventHandler } from 'react';
import { Form, Input, Row, Col, Button, Alert } from 'antd';
import styled from 'styled-components';
import { FormComponentProps } from 'antd/lib/form';
import { Link } from 'react-router-dom';
import { Wordmark } from '../../components/brand';
import { signup, clearAuthErrors } from '../../store/modules/auth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import compose from '../../util/compose';
import { withLayout } from '../../hocs';
import { Layouts } from '../../hocs/with-layout/Layouts';

const RoundedBox = styled.div`
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
    margin-top: 24px;
  }
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

const LegalLink = styled(Link)`
  font-weight: 600;
  color: ${(props) => props.theme['@muted']};
`;

const GotoLogin = styled.div`
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

interface SelectedState {
  isAuthPending: boolean;
  authErrors: string[];
}

const enhance = compose(
  withLayout(Layouts.NONE),
  Form.create<Props>({ name: 'signup' })
);

const Signup = enhance((props: Props) => {
  const dispatch = useDispatch();
  const { isAuthPending, authErrors } = useSelector<RootState, SelectedState>(
    (state) => ({
      isAuthPending: state.auth.isPending,
      authErrors: state.auth.errors,
    })
  );
  const validateThenSignup: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    props.form.validateFields((errors, user: FormValues) => {
      if (errors) {
        // let ant design decide to
        console.error(errors);
        return;
      }
      dispatch(signup(user));
    });
  };
  const clearErrors: MouseEventHandler<HTMLAnchorElement> = (event) => {
    dispatch(clearAuthErrors());
  };

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
    <>
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
                    required
                    placeholder="email"
                    disabled={isAuthPending}
                  />
                )}
              </Form.Item>
              <Form.Item>
                {usernameFieldDecorator(
                  <Input
                    required
                    placeholder="username"
                    disabled={isAuthPending}
                  />
                )}
              </Form.Item>
              <Form.Item>
                {passwordFieldDecorator(
                  <Input.Password
                    required
                    placeholder="password"
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
                  Signup
                </Button>
              </Form.Item>
            </Form>
            <Legal>
              By signing up, you agree to our{' '}
              <LegalLink to="/terms">terms</LegalLink>
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
                <ul>
                  {authErrors.map((authError, authErrorNdx) => {
                    return <li key={authErrorNdx}>{authError}</li>;
                  })}
                </ul>
              }
            />
          </Col>
        </Row>
      ) : null}

      <Row type="flex" justify="center" align="middle">
        <Col {...SPANS}>
          <RoundedBox>
            <GotoLogin>
              Have an account? <Link to="/login">login</Link>
            </GotoLogin>
          </RoundedBox>
        </Col>
      </Row>
    </>
  );
});

export default Signup;

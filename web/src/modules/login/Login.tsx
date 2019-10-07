import React, { useEffect, FormEventHandler } from 'react';
import compose from '../../util/compose';
import { withLayout } from '../../hocs';
import { Layouts } from '../../hocs/with-layout/Layouts';
import styled from 'styled-components';
import { Alert, Form, Row, Col, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import { FormComponentProps } from 'antd/lib/form';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthErrors, login } from '../../store/modules/auth';
import { Wordmark } from '../../components/brand';

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

const SignupLink = styled.div`
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
  emailOrUsername: string;
  password: string;
}

interface SelectedAuthState {
  isAuthPending: boolean;
  authErrors: string[];
}

const enhance = compose(
  withLayout(Layouts.NONE),
  Form.create<Props>({ name: 'login' })
);

const Login: React.FC<Props> = enhance((props: Props) => {
  const dispatch = useDispatch();
  const { isAuthPending, authErrors } = useSelector<
    RootState,
    SelectedAuthState
  >((state) => ({
    isAuthPending: state.auth.isPending,
    authErrors: state.auth.errors,
  }));

  const validateThenLogin: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    props.form.validateFields((errors, loginInput: FormValues) => {
      if (errors) {
        // let ant design decide to
        console.error(errors);
        return;
      }
      dispatch(login(loginInput));
    });
  };
  const clearErrors = () => dispatch(clearAuthErrors());
  useEffect(() => {
    clearErrors();
  }, []);

  const { getFieldDecorator } = props.form;
  const emailOrUsernameFieldDecorator = getFieldDecorator('emailOrUsername', {
    rules: [{ required: true, message: 'email or username is required' }],
  });
  const passwordFieldDecorator = getFieldDecorator('password', {
    rules: [{ required: true, message: 'password is required' }],
  });

  return (
    <>
      <Row type="flex" justify="center" align="middle">
        <Col {...SPANS}>
          <RoundedBox>
            <Link to="library">
              <StyledH1>
                <Wordmark />
              </StyledH1>
            </Link>
            <Form onSubmit={validateThenLogin}>
              <Form.Item>
                {emailOrUsernameFieldDecorator(
                  <Input
                    placeholder="email or username"
                    disabled={isAuthPending}
                  />
                )}
              </Form.Item>
              <Form.Item>
                {passwordFieldDecorator(
                  <Input.Password
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
                  login
                </Button>
              </Form.Item>
            </Form>
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
            <SignupLink>
              Don't have an account? <Link to="signup">signup</Link>
            </SignupLink>
          </RoundedBox>
        </Col>
      </Row>
    </>
  );
});

export default Login;

import React, { FormEventHandler } from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import styled from 'styled-components';
import { FormComponentProps } from 'antd/lib/form';
import { Link } from 'react-router-dom';
import { Wordmark } from '../../components/brand';
import { createSignupAction } from '../../store/modules/auth/types';
import { useDispatch } from 'react-redux';

const RoundedBox = styled.div`
  margin-top: 24px;
  background: white;
  border: 1px solid ${(props) => props.theme['@border-color']};
  border-radius: 4px;
  padding: 24px;
  max-width: 320px;
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

const withForm = Form.create<Props>({
  name: 'signup',
});

const Signup = withForm((props: Props) => {
  const dispatch = useDispatch();

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

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    props.form.validateFields((errors, values: FormValues) => {
      if (errors) {
        console.error(errors);
        return;
      }
      console.log('dispatching');
      dispatch(createSignupAction(values));
    });
  };

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
            <Form onSubmit={handleSubmit}>
              <Form.Item>
                {emailFieldDecorator(<Input required placeholder="email" />)}
              </Form.Item>
              <Form.Item>
                {usernameFieldDecorator(
                  <Input required placeholder="username" />
                )}
              </Form.Item>
              <Form.Item>
                {passwordFieldDecorator(
                  <Input.Password placeholder="password" />
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
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

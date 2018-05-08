import React from 'react';
import styled from 'react-emotion';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { compose, setDisplayName, withState, withHandlers, withProps } from 'recompose';
import { Link } from 'react-router-dom';
import { SessionErrors } from '../';
import { signup } from 'data';
import { connect } from 'react-redux';

const { Item } = Form;

const enhance = compose(
  Form.create(),
  connect(
    null,
    dispatch => ({
      signup: user => dispatch(signup(user))
    })
  ),
  withState('confirmDirty', 'setConfirmDirty', false),
  withState('loading', 'setLoading', false),
  withState('errors', 'setErrors', []),
  withProps(props => ({
    trySignup: async user => {
      props.setLoading(true);

      try {
        await props.signup(user);
      } catch (error) {
        if (error.responseJSON) {
          props.setErrors(error.responseJSON.message || []);
        } else {
          console.error(error);
        }
      }

      props.setLoading(false);
    }
  })),
  withProps(props => ({
    checkPasswordConfirm: (form, otherPasswordField) => (rule, value, callback) => {
      const otherValue = form.getFieldValue(otherPasswordField);

      if (value && otherValue && value !== otherValue) {
        callback('passwords do not match');
      } else {
        callback();
      }
    }
  })),
  withHandlers({
    handleConfirmBlur: props => event => {
      const { value } = event.target;
      props.setConfirmDirty(props.confirmDity || !!value);
    },
    afterValidate: props => (errors, user) => {''
      if (!errors) {
        props.trySignup(user);
      }
    }
  }),
  withHandlers({
    handleSubmit: props => event => {
      event.preventDefault();
      props.form.validateFields(props.afterValidate);
    }
  })
);

const SignupButton = styled(Button) `
  width: 100%;
`;

const Footer = styled('div')`
  width: 100%;
  text-align: center;
`;

const SignupForm = enhance(props => (
  <div>
    <Form onSubmit={props.handleSubmit}>
      <Item>
        {props.form.getFieldDecorator('username', {
          rules: [
            { required: true, message: 'username is required' },
            { min: 3, message: 'must be at least 3 characters' },
            { max: 30, message: 'must be at most 30 characters' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: 'must only contain letters, numbers, or underscores' },
            { pattern: /[a-zA-Z0-9]{1,}/, message: 'must have at least one letter or number' }
          ],
        })(
          <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="username" />
        )}
      </Item>
      <Item>
        {props.form.getFieldDecorator('email', {
          rules: [
            { type: 'email', message: 'please enter a valid email' },
            { required: true, message: 'email is required' },
            { max: 30, message: 'must be at most 30 characters' },
          ],
        })(
          <Input prefix={<Icon type="inbox" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="email" />
        )}
      </Item>
      <Item>
        {props.form.getFieldDecorator('password', {
          rules: [
            { required: true, message: 'password is required' },
            { min: 6, message: 'must be at least 6 characters' },
            { max: 20, message: 'must be at most 20 characters' },
            { pattern: /^((?![<>;]).)*$/, message: 'must not contain <, >, or ;' },
            { validator: props.checkPasswordConfirm(props.form, 'passwordConfirmation') }
          ],
        })(
          <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="password" />
        )}
      </Item>
      <Item>
        {props.form.getFieldDecorator('passwordConfirmation', {
          rules: [
            { required: true, message: 'confirm your password' },
            { validator: props.checkPasswordConfirm(props.form, 'password') }
          ],
        })(
          <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="confirm password" />
        )}
      </Item>
      <Item>
        <SignupButton type="primary" htmlType="submit" loading={props.loading}>
          signup
        </SignupButton>
      </Item>
    </Form>
    <Footer>
      Already have an account? <Link to="/login">login</Link>
    </Footer>
    <SessionErrors errors={props.errors} />
  </div>
));

export default SignupForm;

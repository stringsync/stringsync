import * as React from 'react';
import { compose, withProps } from 'recompose';
import { Alert } from 'antd';

interface IProps {
  error: string | null;
}

interface IAlertProps {
  alertType: 'error' | 'success';
  message: string;
}

type InnerProps = IProps & IAlertProps;

const enhance = compose<InnerProps, IProps>(
  withProps<IAlertProps, IProps>(props => ({
    alertType: props.error ? 'error' : 'success',
    message: props.error || 'no errors'
  }))
);

export const Status = enhance(props => (
  <Alert type={props.alertType} message={props.message} />
));

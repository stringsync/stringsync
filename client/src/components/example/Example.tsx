import * as React from 'react';
import { Button } from 'antd';

export interface IProps {
  label: string;
  disabled: boolean;
}

export const Example: React.SFC<IProps> = (props) => (
  <Button disabled={props.disabled}>
    {props.label}
  </Button>
);

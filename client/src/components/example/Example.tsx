import * as React from 'react';

export interface IProps {
  label: string;
  disabled: boolean;
}

export const Example: React.SFC<IProps> = (props) => (
  <button disabled={props.disabled}>
    {props.label}
  </button>
);

import Button, { ButtonProps } from 'antd/lib/button';
import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';

type Props = Omit<ButtonProps, 'disabled'> & {
  timeoutMs: number;
  onTimeout?: () => void;
};

export const TimeoutButton: React.FC<Props> = (props) => {
  const [disabled, setDisabled] = useState(false);

  const onClick = useCallback<MouseEventHandler<HTMLElement>>(
    (event) => {
      setDisabled(true);
      props.onClick && props.onClick(event);
    },
    [props]
  );

  useEffect(() => {
    if (!disabled) {
      return;
    }
    const handle = setTimeout(() => {
      setDisabled(false);
      props.onTimeout && props.onTimeout();
    }, props.timeoutMs);
    return () => {
      clearTimeout(handle);
    };
  }, [disabled, props]);

  return <Button {...{ ...props, disabled, onClick }} />;
};

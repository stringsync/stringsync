import React, { useState } from 'react';
import { useTimeout } from '../hooks/useTimeout';
import { Duration } from '../util/Duration';

export const withRenderDelay = (delay: Duration) => {
  return function<P>(Component: React.ComponentType<P>): React.FC<P> {
    return (props) => {
      const [visible, setVisible] = useState(false);
      useTimeout(() => setVisible(true), delay.ms);
      return visible ? null : <Component {...props} />;
    };
  };
};

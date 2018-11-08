import * as React from 'react';
import noop from './noop';

export const NotationContext = React.createContext({
  notations: ['foo', 'bar', 'baz'],
  updateNotations: noop
});

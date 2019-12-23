import React from 'react';
import { useEffectOnce } from './useEffectOnce';
import { render } from '@testing-library/react';

it('calls the callback once', () => {
  const callback = jest.fn();
  const Component = () => {
    useEffectOnce(callback);
    return null;
  };

  const component = <Component />;
  const { rerender } = render(component);
  rerender(component);

  expect(callback).toBeCalledTimes(1);
});

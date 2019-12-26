import React from 'react';
import { useEffectOnce } from './useEffectOnce';
import { render } from '@testing-library/react';

it('calls the callback once', () => {
  const callback = jest.fn();
  const Component = () => {
    useEffectOnce(callback);
    return null;
  };

  const { rerender } = render(<Component />);
  rerender(<Component />);

  expect(callback).toBeCalledTimes(1);
});

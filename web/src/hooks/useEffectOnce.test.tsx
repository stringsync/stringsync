import { render } from '@testing-library/react';
import React, { EffectCallback } from 'react';
import { useEffectOnce } from './useEffectOnce';

describe('useEffectOnce', () => {
  it('only calls the callback once', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const Component: React.FC<{ callback: EffectCallback }> = (props) => {
      useEffectOnce(props.callback);
      return null;
    };

    const { rerender } = render(<Component callback={callback1} />);
    rerender(<Component callback={callback2} />);

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();
  });
});

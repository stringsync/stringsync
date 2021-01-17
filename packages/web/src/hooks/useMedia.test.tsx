import { render } from '@testing-library/react';
import React from 'react';
import { useMedia } from './useMedia';

describe('useMedia', () => {
  it('changes the value based on the viewport dimensions', () => {
    const query1 = '(max-width: 200px)';
    const query2 = '(max-width: 400px)';
    const value1 = 'value1';
    const value2 = 'value2';
    const defaultValue = 'defaultValue';

    jest.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === query1, // match query1
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const Component = () => {
      const value = useMedia([query1, query2], [value1, value2], defaultValue);
      return <div>{value}</div>;
    };
    const { getByText } = render(<Component />);

    expect(getByText(value1)).not.toBeNull();
  });
});

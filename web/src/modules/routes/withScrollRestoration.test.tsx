import React from 'react';
import { withScrollRestoration } from './withScrollRestoration';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

const Dummy = () => <div data-testid="dummy" />;

it('scrolls to (0, 0)', () => {
  window.scrollTo = jest.fn();
  const Component = withScrollRestoration(Dummy);
  const { TestComponent } = getTestComponent(Component, {});

  render(<TestComponent />);

  expect(window.scrollTo).toBeCalledTimes(1);
  expect(window.scrollTo).toBeCalledWith(0, 0);
});

import React from 'react';
import { withScrollRestoration } from './withScrollRestoration';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';
import { useHistory } from 'react-router';

afterEach(() => {
  jest.restoreAllMocks();
});

it('scrolls to (0, 0)', () => {
  window.scrollTo = jest.fn();
  const Component = withScrollRestoration(() => <div />);
  const { TestComponent } = getTestComponent(Component, {});

  render(<TestComponent />);

  expect(window.scrollTo).toBeCalledTimes(1);
  expect(window.scrollTo).toBeCalledWith(0, 0);
});

it('does not scroll on every rerender', () => {
  window.scrollTo = jest.fn();
  const Component = withScrollRestoration(() => <div />);
  const { TestComponent } = getTestComponent(Component, {});

  const { rerender } = render(<TestComponent />);
  rerender(<TestComponent />);

  expect(window.scrollTo).toBeCalledTimes(1);
});

it('scrolls to (0, 0) on location change', () => {
  window.scrollTo = jest.fn();
  let history: ReturnType<typeof useHistory>;
  const Component = withScrollRestoration(() => {
    history = useHistory();
    return <div />;
  });
  const { TestComponent } = getTestComponent(Component, {});

  const { rerender } = render(<TestComponent />);
  expect(window.scrollTo).toBeCalledTimes(1);

  history.push('foobar');
  rerender(<TestComponent />);
  expect(window.scrollTo).toBeCalledTimes(2);
});

import { render } from '@testing-library/react';
import React, { useEffect } from 'react';
import { PromiseState, PromiseStatus } from '../util/types';
import { AsyncCallback, useAsyncCallback } from './useAsyncCallback';

type onStateChangeCallback = (state: PromiseState<any>) => void;

type Props = {
  id: symbol;
  asyncCallback: AsyncCallback<symbol, [symbol]>;
  onStateChange: onStateChangeCallback;
};

const Component: React.FC<Props> = ({ id, asyncCallback, onStateChange }) => {
  const [callback, state] = useAsyncCallback(asyncCallback);

  useEffect(() => {
    callback(id);
  }, [id, callback]);

  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  return (
    <div>{state.status === PromiseStatus.Idle || state.status === PromiseStatus.Pending ? 'waiting' : 'done'}</div>
  );
};

describe('useAsyncCallback', () => {
  it('invokes a function asynchronously', async () => {
    const id = Symbol();
    const asyncCallback = jest.fn().mockResolvedValue(id);
    const onStateChange = jest.fn();

    const { findByText } = render(<Component id={id} asyncCallback={asyncCallback} onStateChange={onStateChange} />);
    await findByText('done');

    expect(asyncCallback).toHaveBeenCalledTimes(1);
    expect(asyncCallback).toHaveBeenLastCalledWith(id);
    expect(onStateChange).toHaveBeenCalledTimes(3);
    expect(onStateChange).toHaveBeenNthCalledWith(1, {
      status: PromiseStatus.Idle,
      error: undefined,
      result: undefined,
    });
    expect(onStateChange).toHaveBeenNthCalledWith(2, {
      status: PromiseStatus.Pending,
      error: undefined,
      result: undefined,
    });
    expect(onStateChange).toHaveBeenLastCalledWith({
      status: PromiseStatus.Resolved,
      error: undefined,
      result: id,
    });
  });

  it('handles rejections', async () => {
    const id = Symbol();
    const error = new Error('some error');
    const asyncCallback = jest.fn().mockRejectedValue(error);
    const onStateChange = jest.fn();

    const { findByText } = render(<Component id={id} asyncCallback={asyncCallback} onStateChange={onStateChange} />);
    await findByText('done');

    expect(asyncCallback).toHaveBeenCalledTimes(1);
    expect(asyncCallback).toHaveBeenLastCalledWith(id);
    expect(onStateChange).toHaveBeenCalledTimes(3);
    expect(onStateChange).toHaveBeenNthCalledWith(1, {
      status: PromiseStatus.Idle,
      error: undefined,
      result: undefined,
    });
    expect(onStateChange).toHaveBeenNthCalledWith(2, {
      status: PromiseStatus.Pending,
      error: undefined,
      result: undefined,
    });
    expect(onStateChange).toHaveBeenLastCalledWith({
      status: PromiseStatus.Rejected,
      error,
      result: undefined,
    });
  });

  it('cancels when invoking multiple times before resolve', async () => {
    const id1 = Symbol('1');
    const id2 = Symbol('2');
    const asyncCallback = jest.fn().mockImplementation(async (id) => id);
    const onStateChange = jest.fn();

    const { rerender, findByText } = render(
      <Component id={id1} asyncCallback={asyncCallback} onStateChange={onStateChange} />
    );
    rerender(<Component id={id2} asyncCallback={asyncCallback} onStateChange={onStateChange} />);
    await findByText('done');

    expect(asyncCallback).toHaveBeenCalledTimes(2);
    expect(asyncCallback).toHaveBeenNthCalledWith(1, id1);
    expect(asyncCallback).toHaveBeenLastCalledWith(id2);
    expect(onStateChange).toHaveBeenCalledTimes(3);
    expect(onStateChange).toHaveBeenNthCalledWith(1, {
      status: PromiseStatus.Idle,
      error: undefined,
      result: undefined,
    });
    expect(onStateChange).toHaveBeenNthCalledWith(2, {
      status: PromiseStatus.Pending,
      error: undefined,
      result: undefined,
    });
    expect(onStateChange).toHaveBeenLastCalledWith({
      status: PromiseStatus.Resolved,
      error: undefined,
      result: id2,
    });
  });

  it('handles multiple separate invocations', async () => {
    const id1 = Symbol('1');
    const id2 = Symbol('2');
    const asyncCallback = jest.fn().mockImplementation(async (id) => id);
    const onStateChange = jest.fn();

    const { rerender, findByText } = render(
      <Component id={id1} asyncCallback={asyncCallback} onStateChange={onStateChange} />
    );
    await findByText('done');
    rerender(<Component id={id2} asyncCallback={asyncCallback} onStateChange={onStateChange} />);
    await findByText('done');

    expect(asyncCallback).toHaveBeenCalledTimes(2);
    expect(asyncCallback).toHaveBeenNthCalledWith(1, id1);
    expect(asyncCallback).toHaveBeenLastCalledWith(id2);
    expect(onStateChange).toHaveBeenCalledTimes(5);
    expect(onStateChange).toHaveBeenNthCalledWith(1, {
      status: PromiseStatus.Idle,
      error: undefined,
      result: undefined,
    });
    expect(onStateChange).toHaveBeenNthCalledWith(2, {
      status: PromiseStatus.Pending,
      error: undefined,
      result: undefined,
    });
    expect(onStateChange).toHaveBeenNthCalledWith(3, {
      status: PromiseStatus.Resolved,
      error: undefined,
      result: id1,
    });
    expect(onStateChange).toHaveBeenNthCalledWith(4, {
      status: PromiseStatus.Pending,
      error: undefined,
      result: undefined,
    });
    expect(onStateChange).toHaveBeenLastCalledWith({
      status: PromiseStatus.Resolved,
      error: undefined,
      result: id2,
    });
  });
});

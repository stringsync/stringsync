import { render } from '@testing-library/react';
import React, { useEffect } from 'react';
import { PromiseState, PromiseStatus } from '../util/types';
import { AsyncCallback, CancelCallback, useAsync } from './useAsync';

type onStateChangeCallback = (state: PromiseState<any>) => void;

type Props = {
  id: symbol;
  asyncCallback: AsyncCallback<symbol, [symbol]>;
  onStateChange: onStateChangeCallback;
  onCancel: CancelCallback;
};

const Component: React.FC<Props> = ({ id, asyncCallback, onStateChange, onCancel }) => {
  const [invoker, state] = useAsync(asyncCallback, { cancel: onCancel });

  useEffect(() => {
    invoker(id);
  }, [id, invoker]);

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
    const onCancel = jest.fn();

    const { findByText } = render(
      <Component id={id} asyncCallback={asyncCallback} onStateChange={onStateChange} onCancel={onCancel} />
    );
    await findByText('done');

    expect(onCancel).not.toHaveBeenCalled();
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
    const onCancel = jest.fn();

    const { findByText } = render(
      <Component id={id} asyncCallback={asyncCallback} onStateChange={onStateChange} onCancel={onCancel} />
    );
    await findByText('done');

    expect(onCancel).not.toHaveBeenCalled();
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
    const onCancel = jest.fn();

    const { rerender, findByText } = render(
      <Component id={id1} asyncCallback={asyncCallback} onStateChange={onStateChange} onCancel={onCancel} />
    );
    rerender(<Component id={id2} asyncCallback={asyncCallback} onStateChange={onStateChange} onCancel={onCancel} />);
    await findByText('done');

    expect(onCancel).toHaveBeenCalledTimes(1);
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
    const onCancel = jest.fn();

    const { rerender, findByText } = render(
      <Component id={id1} asyncCallback={asyncCallback} onStateChange={onStateChange} onCancel={onCancel} />
    );
    await findByText('done');
    rerender(<Component id={id2} asyncCallback={asyncCallback} onStateChange={onStateChange} onCancel={onCancel} />);
    await findByText('done');

    expect(onCancel).toHaveBeenCalledTimes(1);
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

  it('cancels when the async callback changes', async () => {
    const id = Symbol();
    const asyncCallback1 = jest.fn().mockImplementation(async (id) => id);
    const asyncCallback2 = jest.fn().mockImplementation(async (id) => id);
    const onStateChange = jest.fn();
    const onCancel = jest.fn();

    const { rerender, findByText } = render(
      <Component id={id} asyncCallback={asyncCallback1} onStateChange={onStateChange} onCancel={onCancel} />
    );
    rerender(<Component id={id} asyncCallback={asyncCallback2} onStateChange={onStateChange} onCancel={onCancel} />);
    await findByText('done');

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('cancels when the cancel callback changes', async () => {
    const id = Symbol();
    const asyncCallback = jest.fn().mockResolvedValue(id);
    const onStateChange = jest.fn();
    const onCancel1 = jest.fn();
    const onCancel2 = jest.fn();

    const { rerender, findByText } = render(
      <Component id={id} asyncCallback={asyncCallback} onStateChange={onStateChange} onCancel={onCancel1} />
    );
    rerender(<Component id={id} asyncCallback={asyncCallback} onStateChange={onStateChange} onCancel={onCancel2} />);
    await findByText('done');

    expect(onCancel1).toHaveBeenCalledTimes(1);
    expect(onCancel2).not.toHaveBeenCalled();
  });
});

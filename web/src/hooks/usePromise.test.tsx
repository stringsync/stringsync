import { render } from '@testing-library/react';
import React, { useEffect } from 'react';
import { PromiseStatus, usePromise } from './usePromise';

describe('usePromise', () => {
  it('resolves values', async () => {
    const onPromiseChange = jest.fn();
    const args: [symbol] = [Symbol()];
    const resolveImmediately = (arg: symbol) => Promise.resolve(arg);

    const Component: React.FC = () => {
      const { result, error, status } = usePromise(resolveImmediately, args);
      useEffect(() => {
        onPromiseChange({ result, error, status });
      }, [result, error, status]);
      return <div>{status === PromiseStatus.Pending ? 'pending' : 'done'}</div>;
    };

    const { findByText } = render(<Component />);
    await findByText('done');

    expect(onPromiseChange).toHaveBeenCalledTimes(2);
    expect(onPromiseChange).toHaveBeenCalledWith({
      result: undefined,
      error: undefined,
      status: PromiseStatus.Pending,
    });
    expect(onPromiseChange).toHaveBeenCalledWith({
      result: args[0],
      error: undefined,
      status: PromiseStatus.Resolved,
    });
  });

  it('rejects values', async () => {
    const onPromiseChange = jest.fn();
    const args: [symbol] = [Symbol()];
    const error = new Error();
    const rejectImmediately = (arg: symbol) => Promise.reject(error);

    const Component: React.FC = () => {
      const { result, error, status } = usePromise(rejectImmediately, args);
      useEffect(() => {
        onPromiseChange({ result, error, status });
      }, [result, error, status]);
      return <div>{status === PromiseStatus.Pending ? 'pending' : 'done'}</div>;
    };

    const { findByText } = render(<Component />);
    await findByText('done');

    expect(onPromiseChange).toHaveBeenCalledTimes(2);
    expect(onPromiseChange).toHaveBeenCalledWith({
      result: undefined,
      error: undefined,
      status: PromiseStatus.Pending,
    });
    expect(onPromiseChange).toHaveBeenCalledWith({
      result: undefined,
      error,
      status: PromiseStatus.Rejected,
    });
  });

  it('ignores cancelled promises', async () => {
    const onPromiseChange = jest.fn();
    const args1: [symbol] = [Symbol()];
    const args2: [symbol] = [Symbol()];
    const resolveImmediately = (arg: symbol) => Promise.resolve(arg);

    const Component: React.FC<{ args: [symbol] }> = (props) => {
      const { result, error, status } = usePromise(resolveImmediately, props.args);
      useEffect(() => {
        onPromiseChange({ result, error, status });
      }, [result, error, status]);
      return <div>{status === PromiseStatus.Pending ? 'pending' : 'done'}</div>;
    };

    // Cancel the args1 call by re-rendering immediately
    const { rerender, findByText } = render(<Component args={args1} />);
    rerender(<Component args={args2} />);
    await findByText('done');

    expect(onPromiseChange).toHaveBeenCalledTimes(2);
    expect(onPromiseChange).toHaveBeenCalledWith({
      result: undefined,
      error: undefined,
      status: PromiseStatus.Pending,
    });
    expect(onPromiseChange).not.toHaveBeenCalledWith({
      result: args1[0],
      error: undefined,
      status: PromiseStatus.Resolved,
    });
    expect(onPromiseChange).toHaveBeenCalledWith({
      result: args2[0],
      error: undefined,
      status: PromiseStatus.Resolved,
    });
  });
});

import { render } from '@testing-library/react';
import React, { useEffect } from 'react';
import { PromiseStatus } from '../util/types';
import { useImmediatePromise } from './useImmediatePromise';

describe('usePromise', () => {
  const args1 = Symbol();
  const args2 = Symbol();
  const callback1 = async () => args1;
  const callback2 = async () => args2;

  beforeEach(() => {});

  it('resolves values', async () => {
    const onPromiseChange = jest.fn();

    const Component: React.FC = () => {
      const { result, error, status } = useImmediatePromise(callback1);
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
      result: args1,
      error: undefined,
      status: PromiseStatus.Resolved,
    });
  });

  it('rejects values', async () => {
    const onPromiseChange = jest.fn();
    const error = new Error();
    const rejectImmediately = () => Promise.reject(error);

    const Component: React.FC = () => {
      const { result, error, status } = useImmediatePromise(rejectImmediately);
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

    const Component: React.FC<{ callback: () => Promise<symbol> }> = (props) => {
      const { result, error, status } = useImmediatePromise(props.callback);
      useEffect(() => {
        onPromiseChange({ result, error, status });
      }, [result, error, status]);
      return <div>{status === PromiseStatus.Pending ? 'pending' : 'done'}</div>;
    };

    // Cancel the args1 call by re-rendering immediately
    const { rerender, findByText } = render(<Component callback={callback1} />);
    rerender(<Component callback={callback2} />);
    await findByText('done');

    expect(onPromiseChange).toHaveBeenCalledTimes(2);
    expect(onPromiseChange).toHaveBeenCalledWith({
      result: undefined,
      error: undefined,
      status: PromiseStatus.Pending,
    });
    expect(onPromiseChange).not.toHaveBeenCalledWith({
      result: args1,
      error: undefined,
      status: PromiseStatus.Resolved,
    });
    expect(onPromiseChange).toHaveBeenCalledWith({
      result: args2,
      error: undefined,
      status: PromiseStatus.Resolved,
    });
  });
});

import { AsyncLoop } from './AsyncLoop';

const raf = () => new Promise(requestAnimationFrame);

describe('AyncLoop', () => {
  let callback: jest.Mock;
  let loop: AsyncLoop;

  beforeEach(() => {
    callback = jest.fn();
    loop = new AsyncLoop(callback);
  });

  afterEach(() => {
    loop.stop();
  });

  it('calls the callback after starting', async () => {
    loop.start();
    await raf();
    expect(callback).toHaveBeenCalled();
  });

  it('stops calling the callback after stopping', async () => {
    loop.start();
    await raf();

    loop.stop();
    const numCallsAfterStopping = callback.mock.calls.length;
    await raf();

    expect(callback).toHaveBeenCalledTimes(numCallsAfterStopping);
  });
});

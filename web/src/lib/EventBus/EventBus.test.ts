import { EventBus } from './EventBus';

type TestSubscriberSpec = {
  click: { x: number; y: number };
  exit: { force: boolean };
};

describe('EventBus', () => {
  let eventBus: EventBus<TestSubscriberSpec>;
  let clickPayload: TestSubscriberSpec['click'];
  let exitPayload: TestSubscriberSpec['exit'];

  beforeEach(() => {
    eventBus = new EventBus();
    clickPayload = { x: 0, y: 0 };
    exitPayload = { force: true };
  });

  it('can register a single subscriber', () => {
    const callback = jest.fn();
    eventBus.subscribe('click', callback);

    eventBus.dispatch('click', clickPayload);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(clickPayload);
  });

  it('can register subscribers for multiple events', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    eventBus.subscribe('click', callback1);
    eventBus.subscribe('exit', callback2);

    eventBus.dispatch('click', clickPayload);
    eventBus.dispatch('exit', exitPayload);

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback1).toHaveBeenCalledWith(clickPayload);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledWith(exitPayload);
  });

  it('can register multiple subscribers for a single event', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    eventBus.subscribe('click', callback1);
    eventBus.subscribe('click', callback2);

    eventBus.dispatch('click', clickPayload);

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback1).toHaveBeenCalledWith(clickPayload);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledWith(clickPayload);
  });

  it('can register a single callback multiple times', () => {
    const callback = jest.fn();

    eventBus.subscribe('click', callback);
    eventBus.subscribe('click', callback);

    eventBus.dispatch('click', clickPayload);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(clickPayload);
  });

  it('can unsubscribe events', () => {
    const callback = jest.fn();

    const id = eventBus.subscribe('click', callback);
    eventBus.unsubscribe(id);

    eventBus.dispatch('click', clickPayload);

    expect(callback).not.toHaveBeenCalled();
  });

  it('can unsubscribe events multiple times', () => {
    const callback = jest.fn();

    const id = eventBus.subscribe('click', callback);
    eventBus.unsubscribe(id);
    eventBus.unsubscribe(id);

    eventBus.dispatch('click', clickPayload);

    expect(callback).not.toHaveBeenCalled();
  });

  it('can unsubscribe a single callback used multiple times', () => {
    const callback = jest.fn();

    const id = eventBus.subscribe('click', callback);
    eventBus.subscribe('click', callback); // this one should survive
    eventBus.unsubscribe(id);

    eventBus.dispatch('click', clickPayload);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(clickPayload);
  });

  it('ignores unsubscribing random ids', () => {
    expect(() => eventBus.unsubscribe(Symbol('hello'))).not.toThrow();
  });
});

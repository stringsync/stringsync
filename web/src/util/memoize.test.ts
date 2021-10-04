import { InternalError } from '../errors';
import { memoize } from './memoize';

describe('memoize', () => {
  it('memoizes methods', () => {
    const symbol = Symbol();
    const fn = jest.fn().mockReturnValue(symbol);

    class MyClass {
      @memoize()
      fn() {
        return fn();
      }
    }

    const instance = new MyClass();
    const value1 = instance.fn();
    const value2 = instance.fn();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(value1).toBe(symbol);
    expect(value2).toBe(symbol);
  });

  it('memoizes per instance', () => {
    const symbol = Symbol();
    const fn = jest.fn().mockReturnValue(symbol);

    class MyClass {
      @memoize()
      fn() {
        return fn();
      }
    }

    const instance1 = new MyClass();
    const instance2 = new MyClass();
    const value1 = instance1.fn();
    const value2 = instance2.fn();

    expect(fn).toHaveBeenCalledTimes(2);
    expect(value1).toBe(symbol);
    expect(value2).toBe(symbol);
  });

  it(`calls with the 'this' arg`, () => {
    class MyClass {
      @memoize()
      fn() {
        return this;
      }
    }

    const instance = new MyClass();
    const value = instance.fn();

    expect(value).toBe(instance);
  });

  it(`does not permit when unbound`, () => {
    class MyClass {
      @memoize()
      fn() {
        return this;
      }
    }

    const instance = new MyClass();
    const fn = instance.fn.bind(undefined);
    expect(fn).toThrow(InternalError);
  });

  // This is an edge case because variadic args do not account for arity (function.length)
  // and are consequently undetectable until the method is called with args.
  it('memoizes methods with variadic args when called with no args', () => {
    const symbol = Symbol();
    const fn = jest.fn().mockReturnValue(symbol);

    class MyClass {
      @memoize()
      fn(...args: any[]) {
        return fn();
      }
    }

    const instance = new MyClass();
    const value1 = instance.fn();
    const value2 = instance.fn();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(value1).toBe(symbol);
    expect(value2).toBe(symbol);
  });

  it('does not permit methods with variadic args when called with args', () => {
    const symbol = Symbol();
    const fn = jest.fn().mockReturnValue(symbol);

    class MyClass {
      @memoize()
      fn(...args: any[]) {
        return fn();
      }
    }

    const instance = new MyClass();
    expect(() => instance.fn('hello')).toThrow(InternalError);
  });

  it('does not permit methods with an arity > 0', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class MyClass {
        @memoize()
        fn(arg: any) {
          return arg;
        }
      }
    }).toThrow(InternalError);
  });

  it('does not permit getters', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class MyClass {
        @memoize()
        get fn() {
          return undefined;
        }
      }
    }).toThrow(InternalError);
  });
});

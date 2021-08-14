import { ago } from './ago';

// helpers to convert to ms
const milliseconds = (v: number) => v;
const seconds = (v: number) => milliseconds(v) * 1000;
const minutes = (v: number) => seconds(v) * 60;
const hours = (v: number) => minutes(v) * 60;
const days = (v: number) => hours(v) * 24;
const weeks = (v: number) => days(v) * 7;
const months = (v: number) => weeks(v) * 4;
const years = (v: number) => months(v) * 12;

describe('ago', () => {
  it.each([
    { deltaMs: milliseconds(5), expectation: '0 seconds ago' },
    { deltaMs: milliseconds(500), expectation: '0 seconds ago' },
    { deltaMs: seconds(1), expectation: '1 second ago' },
    { deltaMs: seconds(30), expectation: '30 seconds ago' },
    { deltaMs: seconds(59), expectation: '59 seconds ago' },
    { deltaMs: minutes(1), expectation: '1 minute ago' },
    { deltaMs: minutes(30), expectation: '30 minutes ago' },
    { deltaMs: minutes(59.9), expectation: '59 minutes ago' },
    { deltaMs: hours(1), expectation: '1 hour ago' },
    { deltaMs: hours(12), expectation: '12 hours ago' },
    { deltaMs: hours(23.9), expectation: '23 hours ago' },
    { deltaMs: days(1), expectation: '1 day ago' },
    { deltaMs: days(6.98), expectation: '6 days ago' },
    { deltaMs: weeks(1), expectation: '1 week ago' },
    { deltaMs: weeks(2), expectation: '2 weeks ago' },
    { deltaMs: weeks(3.98), expectation: '3 weeks ago' },
    { deltaMs: months(1), expectation: '1 month ago' },
    { deltaMs: months(2), expectation: '2 months ago' },
    { deltaMs: months(6), expectation: '6 months ago' },
    { deltaMs: years(1), expectation: '1 year ago' },
    { deltaMs: years(5), expectation: '5 years ago' },
    { deltaMs: years(30), expectation: '30 years ago' },
  ])('passes the following testcase: %o', ({ deltaMs, expectation }) => {
    const t1 = new Date();
    const t2 = new Date(t1.getTime() + deltaMs);
    const timeAgo = ago(t1, t2);
    expect(timeAgo).toBe(expectation);
  });

  it('throws an errors when t1 > t2', () => {
    const t1 = new Date();
    const t2 = new Date(t1.getTime() - 1);
    expect(() => ago(t1, t2)).toThrow();
  });
});

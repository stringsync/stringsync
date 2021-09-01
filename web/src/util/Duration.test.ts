import { Duration } from './Duration';

describe('Duration', () => {
  it('converts from ms to sec', () => {
    expect(Duration.ms(1000).sec).toBe(1);
  });

  it('converts from sec to min', () => {
    expect(Duration.sec(60).min).toBe(1);
  });

  it('converts from min to hr', () => {
    expect(Duration.min(60).hr).toBe(1);
  });

  it('converts from hr to day', () => {
    expect(Duration.hr(24).day).toBe(1);
  });

  it('converts from day to hr', () => {
    expect(Duration.day(1).hr).toBe(24);
  });

  it('converts from hr to min', () => {
    expect(Duration.hr(1).min).toBe(60);
  });

  it('converts from min to sec', () => {
    expect(Duration.min(1).sec).toBe(60);
  });

  it('converts from sec to ms', () => {
    expect(Duration.sec(1).ms).toBe(1000);
  });
});

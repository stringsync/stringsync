import { getInitialDeviceState } from './getInitialDeviceState';

it('runs without crashing', () => {
  expect(getInitialDeviceState).not.toThrow();
});

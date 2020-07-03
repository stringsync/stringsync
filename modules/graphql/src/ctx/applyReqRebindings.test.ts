import { useTestContainer } from '@stringsync/container';
import { applyReqRebindings } from './applyReqRebindings';

const container = useTestContainer();

it('runs without crashing', () => {
  expect(() => applyReqRebindings(container)).not.toThrow();
});

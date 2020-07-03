import { useTestContainer } from '@stringsync/container';
import { createReqContainerHack } from './createReqContainerHack';

const container = useTestContainer();

it('runs without crashing', () => {
  expect(() => createReqContainerHack(container)).not.toThrow();
});

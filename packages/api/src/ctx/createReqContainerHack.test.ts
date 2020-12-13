import { useTestContainer } from '@stringsync/di';
import { API } from '../API';
import { createReqContainerHack } from './createReqContainerHack';

const ref = useTestContainer(API);

it('runs without crashing', () => {
  expect(() => createReqContainerHack(ref.container)).not.toThrow();
});

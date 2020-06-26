import { useTestContainer } from '@stringsync/container';
import { withSession } from './withSession';

const container = useTestContainer();

it('runs without crashing', () => {
  expect(() => withSession(container)).not.toThrow();
});

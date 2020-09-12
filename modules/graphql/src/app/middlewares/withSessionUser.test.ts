import { useTestContainer } from '@stringsync/di';
import { withSessionUser } from './withSessionUser';

const container = useTestContainer();

it('runs without crashing', () => {
  expect(() => withSessionUser(container)).not.toThrow();
});

import { useTestContainer } from '@stringsync/di';
import { API } from '../../API';
import { withSessionUser } from './withSessionUser';

const ref = useTestContainer(API);

it('runs without crashing', () => {
  expect(() => withSessionUser(ref.container)).not.toThrow();
});

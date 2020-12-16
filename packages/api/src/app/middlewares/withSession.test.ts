import { useTestContainer } from '@stringsync/di';
import { API } from '../../API';
import { withSession } from './withSession';

describe('withSession', () => {
  const ref = useTestContainer(API);

  it('runs without crashing', () => {
    expect(() => withSession(ref.container)).not.toThrow();
  });
});

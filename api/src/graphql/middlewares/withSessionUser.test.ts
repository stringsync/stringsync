import { container } from '../../inversify.config';
import { withSessionUser } from './withSessionUser';

describe('withSessionUser', () => {
  it('runs without crashing', () => {
    expect(() => withSessionUser(container)).not.toThrow();
  });
});

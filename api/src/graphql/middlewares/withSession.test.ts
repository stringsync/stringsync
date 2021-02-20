import { container } from '../../inversify.config';
import { withSession } from './withSession';

describe('withSession', () => {
  it('runs without crashing', () => {
    expect(() => withSession(container)).not.toThrow();
  });
});

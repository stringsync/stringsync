import { Container } from './Container';
import { Container as InversifyContainer } from 'inversify';

describe('instance', () => {
  it('returns a inversify Container instance', async () => {
    const container = await Container.instance();
    expect(container).toBeInstanceOf(InversifyContainer);
  });

  it('returns the same inversify Container instance', async () => {
    const container1 = await Container.instance();
    const container2 = await Container.instance();
    expect(container1).toBe(container2);
  });
});

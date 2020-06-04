import { Container } from './Container';
import { Container as InversifyContainer } from 'inversify';

describe('instance', () => {
  it('returns a inversify Container instance', () => {
    expect(Container.instance).toBeInstanceOf(InversifyContainer);
  });
});

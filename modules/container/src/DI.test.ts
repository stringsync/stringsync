import { TYPES } from '@stringsync/container';
import { Container } from 'inversify';
import { DI } from './DI';

let container: Container | undefined;

afterEach(async () => {
  if (container) {
    await DI.teardown(container);
  }
  container = undefined;
});

it('returns an instance for each identifier', () => {
  container = DI.create();

  for (const identifier of Object.values(TYPES)) {
    const object = container.get(identifier);
    expect(object).toBeDefined();
  }
});

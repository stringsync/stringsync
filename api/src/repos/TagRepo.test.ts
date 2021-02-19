import { container } from '../inversify.config';
import { SequelizeTagRepo } from './sequelize';
import { TagRepo } from './types';

describe.each<[string, TagRepo]>([['SequelizeTagRepo', SequelizeTagRepo]])('%s', (name, Ctor) => {
  const id = Symbol(name);
  let tagRepo: TagRepo;

  beforeAll(() => {
    container.bind<TagRepo>(id).to(Ctor);
  });

  afterAll(() => {
    container.unbind(id);
  });
});

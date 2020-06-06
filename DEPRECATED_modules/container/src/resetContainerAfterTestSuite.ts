import { Container } from './Container';

afterAll(async () => {
  // prevents db connections from accumulating
  await Container.reset();
});

import { app } from './app';
import { useTestContainer } from '@stringsync/container';
import request, { SuperTest, Test } from 'supertest';

let req: SuperTest<Test>;

const container = useTestContainer();

beforeEach(() => {
  req = request(app(container));
});

it('GET /health', () => {
  req.get('/health').expect(200);
});

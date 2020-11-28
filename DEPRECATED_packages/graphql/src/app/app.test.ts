import request, { SuperTest, Test } from 'supertest';
import { useTestApp } from '../testing';

const { app } = useTestApp();

let req: SuperTest<Test>;

beforeEach(() => {
  req = request(app);
});

describe('GET /health', () => {
  it('responds with 200', (done) => {
    req.get('/health').expect(200, done);
  });
});

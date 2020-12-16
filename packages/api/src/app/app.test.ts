import { Express } from 'express';
import request, { SuperTest, Test } from 'supertest';
import { useTestApp } from '../testing';

describe('app', () => {
  const ref = useTestApp();

  let app: Express;
  let req: SuperTest<Test>;

  beforeEach(() => {
    app = ref.app;
    req = request(app);
  });

  describe('GET /health', () => {
    it('responds with 200', (done) => {
      req.get('/health').expect(200, done);
    });
  });
});

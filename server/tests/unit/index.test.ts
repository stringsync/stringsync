import app from '../../src/index';
import supertest from 'supertest';

describe('app', () => {
  let req: supertest.SuperTest<supertest.Test>;
  beforeEach(() => {
    req = supertest(app);
  });
  it('should return a successful response for GET /', (done) => {
    req.get('/').expect(200, done);
  });
});

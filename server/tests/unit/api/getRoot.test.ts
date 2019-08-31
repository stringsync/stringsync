import app from '../../../src/server';
import supertest from 'supertest';

describe('GET /', () => {
  it('should return a successful response for GET /', (done) => {
    supertest(app)
      .get('/')
      .expect(200, done);
  });
});

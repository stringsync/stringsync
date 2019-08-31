import app from '../../../src/server';
import supertest from 'supertest';

describe('GET /health', () => {
  it('should return the text ok', (done) => {
    supertest(app)
      .get('/health')
      .expect(200)
      .end((err, res) => {
        done();
      });
  });
});

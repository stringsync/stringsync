import request from 'supertest';
import { getServerConfig } from '../config';
import { getExpressServer } from './getExpressServer';

describe('getExpressServer', () => {
  const config = getServerConfig();

  it('runs without crashing', () => {
    expect(() => getExpressServer(config)).not.toThrow();
  });

  describe('GET /health', () => {
    it('responds with 200', (done) => {
      const server = getExpressServer(config);
      const req = request(server);
      req.get('/health').expect(200, done);
    });
  });
});

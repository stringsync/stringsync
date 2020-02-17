import { convertSessionToCsrf } from './convertSessionToCsrf';

const SESSION_TOKEN = 'SESSION_TOKEN';
const SECRET = 'SECRET';

it('runs without crashing', () => {
  expect(() => convertSessionToCsrf(SESSION_TOKEN, SECRET)).not.toThrow();
});

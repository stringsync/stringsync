import { SIMPLE_CONFIG } from '@stringsync/config';
import { createServer } from './createServer';

const config = SIMPLE_CONFIG();
console.log(config.PORT);
const app = createServer();

app.get('/', async (req, res) => {
  res.send('Hello, world!');
});

app.listen(config.PORT, () => {
  console.log('App is running at http://localhost:3000');
});

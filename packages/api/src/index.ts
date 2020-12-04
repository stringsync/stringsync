import { createServer } from './createServer';

const app = createServer();

app.get('/', async (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => {
  console.log('App is running at http://localhost:3000');
});

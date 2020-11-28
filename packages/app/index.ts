import express from 'express';

const app = express();

app.get('/', async (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, 'App is running at http://localhost:3000');

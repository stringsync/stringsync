import express from 'express';

const app = express();

app.get('*', (req, res, next) => {
  res.send('Hello, world!');
});

app.listen(8080, () => {
  console.log('Server start on port 8080');
});

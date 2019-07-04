import express from 'express';

const app = express();

app.get('*', (req, res, next) => {
  res.json({
    status: 'ok',
    message: 'Hello, world!',
  });
});

app.listen(8080, () => {
  console.log('Server start on port 8080');
});

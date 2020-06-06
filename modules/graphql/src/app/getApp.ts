import express from 'express';

export const getApp = () => {
  const app = express();

  app.get('/', (req, res) => {
    res.send('ok');
  });

  return app;
};

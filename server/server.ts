import express from 'express';
import prisma from './prisma';

const app = express();

app.get('*', async (req, res, next) => {
  const users = await prisma.users();
  res.json(users);
});

app.listen(8080, () => {
  console.log('Server start on port 8080');
});

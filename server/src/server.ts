import express from 'express';
import * as middleware from './middleware';
import * as api from './api';
import cors from 'cors';

const app = express();
const port = 8080;

// middleware
app.use(cors());
app.use(middleware.auth);
app.use('/graphql', middleware.graphql);

// endpoints
app.get('/', api.getRoot);
app.get('/health', api.getHealth);

// only listen for requests if the file was executed
if (require.main === module) {
  app.listen(port);
}

export default app;

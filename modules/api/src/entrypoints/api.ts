import { getConfig } from '../config';
import { getExpressServer } from '../graphql';

const config = getConfig();
const server = getExpressServer(config);

server.listen(config.APP_GRAPHQL_PORT);

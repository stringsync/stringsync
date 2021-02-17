import { getServerConfig } from './config';
import { getExpressServer } from './graphql';

const config = getServerConfig();
const server = getExpressServer(config);

server.listen(config.APP_GRAPHQL_PORT);

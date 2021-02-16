import { $config } from './config';
import { getExpressServer } from './graphql';

const config = $config.getServerConfig();
const server = getExpressServer(config);

server.listen(config.APP_GRAPHQL_PORT);

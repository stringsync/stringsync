import http from 'http';
import * as constants from './constants';
import * as docker from './docker';
import { Project } from './types';
import { cmd, log } from './util';

const isServerUp = async (hostname: string, port: number) => {
  return await new Promise((resolve) => {
    const req = http.request(
      {
        hostname,
        port,
        path: '/health',
        method: 'GET',
      },
      (res) => {
        resolve(res.statusCode === 200);
      }
    );

    req.on('error', () => {
      resolve(false);
    });

    req.end();
  });
};

const waitForServer = async (hostname: string, port: number, maxWaitMs: number) => {
  const start = new Date();

  const getElapsedTimeMs = () => {
    const now = new Date();
    return now.getTime() - start.getTime();
  };

  const wait = (ms: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  process.stdout.write('waiting for graphql.');

  while (getElapsedTimeMs() < maxWaitMs) {
    process.stdout.write('.');

    const isReady = await isServerUp(hostname, port);
    if (isReady) {
      process.stdout.write('\n');
      log('graphql is up');
      return;
    }

    await wait(1000);
  }

  throw new Error('graphql never came up');
};

const generateGraphqlTypes = async () => {
  const api = cmd('yarn', ['typegen'], { cwd: Project.API });
  const web = cmd('yarn', ['typegen'], { cwd: Project.WEB });
  await Promise.allSettled([api, web]);
};

export const typegen = async (hostname: string, port: number, maxWaitMs: number) => {
  const wasServerUp = await isServerUp(hostname, port);
  try {
    if (wasServerUp) {
      log('server already up');
    } else {
      log('temporarily starting server');
      await docker.up(constants.DOCKER_COMPOSE_DEV_FILE);
      await waitForServer(hostname, port, maxWaitMs);
    }

    await generateGraphqlTypes();
  } finally {
    if (!wasServerUp) {
      await docker.down(constants.DOCKER_COMPOSE_DEV_FILE);
    }
  }
};

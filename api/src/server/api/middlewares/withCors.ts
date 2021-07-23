import cors, { CorsOptions } from 'cors';
import { RequestHandler } from 'express';
import { Config } from '../../../config';

export const withCors = (config: Config): RequestHandler => {
  const opts: CorsOptions = { credentials: true };
  if (config.NODE_ENV === 'development') {
    opts.origin = true;
  } else {
    opts.origin = [config.WEB_UI_CDN_DOMAIN_NAME, config.DOMAIN_NAME, `api.${config.DOMAIN_NAME}`];
  }
  return cors(opts);
};

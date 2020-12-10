import {
  APP_WEB_URI,
  CDN_DOMAIN_NAME,
  configFactory,
  NODE_ENV,
  S3_BUCKET,
  S3_VIDEO_SRC_BUCKET,
  SQS_VIDEO_QUEUE_URL,
} from '@stringsync/config';
import { Pkg } from '@stringsync/di';
import { REPOS } from '@stringsync/repos';
import { UTIL } from '@stringsync/util';
import { AuthService } from './Auth';
import { HealthCheckerService } from './HealthChecker';
import { NotationService } from './Notation';
import { NotificationService } from './Notification';
import { TagService } from './Tag';
import { TaggingService } from './Tagging';
import { UserService } from './User';
import { VideoUrlService } from './Video';

export const SERVICES_CONFIG = configFactory({
  NODE_ENV: NODE_ENV,
  APP_WEB_URI: APP_WEB_URI,
  CDN_DOMAIN_NAME: CDN_DOMAIN_NAME,
  S3_BUCKET: S3_BUCKET,
  S3_VIDEO_SRC_BUCKET: S3_VIDEO_SRC_BUCKET,
  SQS_VIDEO_QUEUE_URL: SQS_VIDEO_QUEUE_URL,
});

export type ServicesConfig = ReturnType<typeof SERVICES_CONFIG>;

export const TYPES = {
  ServicesConfig: Symbol('ServicesConfig'),
  HealthCheckerService: Symbol('HealthCheckerService'),
  AuthService: Symbol('AuthService'),
  NotificationService: Symbol('NotificationService'),
  UserService: Symbol('UserService'),
  NotationService: Symbol('NotationService'),
  TagService: Symbol('TagService'),
  TaggingService: Symbol('TaggingService'),
  VideoUrlService: Symbol('VideoUrlService'),
};

export const SERVICES: Pkg<typeof TYPES> = {
  name: 'SERVICES',
  TYPES,
  deps: [REPOS, UTIL],
  bindings: async (bind) => {
    const config = SERVICES_CONFIG();
    bind<ServicesConfig>(TYPES.ServicesConfig).toConstantValue(config);

    bind<HealthCheckerService>(TYPES.HealthCheckerService).to(HealthCheckerService);
    bind<AuthService>(TYPES.AuthService).to(AuthService);
    bind<NotificationService>(TYPES.NotificationService).to(NotificationService);
    bind<UserService>(TYPES.UserService).to(UserService);
    bind<NotationService>(TYPES.NotationService).to(NotationService);
    bind<TagService>(TYPES.TagService).to(TagService);
    bind<TaggingService>(TYPES.TaggingService).to(TaggingService);
    bind<VideoUrlService>(TYPES.VideoUrlService).to(VideoUrlService);
  },
};

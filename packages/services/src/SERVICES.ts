import { Pkg } from '@stringsync/di';
import { REPOS } from '@stringsync/repos';
import { UTIL } from '@stringsync/util';
import { AuthService } from './Auth';
import { HealthCheckerService } from './HealthChecker';
import { NotationService } from './Notation';
import { NotificationService } from './Notification';
import { ServicesConfig, SERVICES_CONFIG } from './SERVICES_CONFIG';
import { SERVICES_TYPES } from './SERVICES_TYPES';
import { TagService } from './Tag';
import { TaggingService } from './Tagging';
import { UserService } from './User';
import { VideoUrlService } from './Video';

export const SERVICES: Pkg = {
  name: 'SERVICES',
  deps: [REPOS, UTIL],
  bindings: async (bind) => {
    const config = SERVICES_CONFIG();
    bind<ServicesConfig>(SERVICES_TYPES.ServicesConfig).toConstantValue(config);

    bind<HealthCheckerService>(SERVICES_TYPES.HealthCheckerService).to(HealthCheckerService);
    bind<AuthService>(SERVICES_TYPES.AuthService).to(AuthService);
    bind<NotificationService>(SERVICES_TYPES.NotificationService).to(NotificationService);
    bind<UserService>(SERVICES_TYPES.UserService).to(UserService);
    bind<NotationService>(SERVICES_TYPES.NotationService).to(NotationService);
    bind<TagService>(SERVICES_TYPES.TagService).to(TagService);
    bind<TaggingService>(SERVICES_TYPES.TaggingService).to(TaggingService);
    bind<VideoUrlService>(SERVICES_TYPES.VideoUrlService).to(VideoUrlService);
  },
};

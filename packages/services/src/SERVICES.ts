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

const TYPES = { ...SERVICES_TYPES };

export const SERVICES: Pkg = {
  name: 'SERVICES',
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

import { SyncMod, TYPES } from '@stringsync/di';
import { AuthService } from './Auth';
import { ServicesConfig, SERVICES_CONFIG } from './config';
import { HealthCheckerService } from './HealthChecker';
import { NotationService } from './Notation';
import { NotificationService } from './Notification';
import { TagService } from './Tag';
import { TaggingService } from './Tagging';
import { UserService } from './User';
import { VideoUrlService } from './Video';

export const SERVICES = new SyncMod((bind) => {
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
});

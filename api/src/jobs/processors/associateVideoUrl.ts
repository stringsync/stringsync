import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { VideoUrlService } from '../../services';
import { Processor } from '../types';

export type AssociateVideoUrlPayload = {};

export const associateVideoUrl: Processor<AssociateVideoUrlPayload> = async () => {
  const videoUrlService = container.get<VideoUrlService>(TYPES.VideoUrlService);
  await videoUrlService.processNextMessage();
};

import { NotFoundError, UnknownError } from '@stringsync/common';
import { inject, injectable } from '@stringsync/di';
import { Logger, Message, MessageQueue, UTIL_TYPES } from '@stringsync/util';
import { NotationService } from '../Notation';
import { ServicesConfig } from '../SERVICES_CONFIG';
import { SERVICES_TYPES } from '../SERVICES_TYPES';

@injectable()
export class VideoUrlService {
  logger: Logger;
  messageQueue: MessageQueue;
  notationService: NotationService;
  config: ServicesConfig;

  constructor(
    @inject(UTIL_TYPES.Logger) logger: Logger,
    @inject(UTIL_TYPES.MessageQueue) messageQueue: MessageQueue,
    @inject(SERVICES_TYPES.NotationService) notationService: NotationService,
    @inject(SERVICES_TYPES.ServicesConfig) config: ServicesConfig
  ) {
    this.logger = logger;
    this.messageQueue = messageQueue;
    this.notationService = notationService;
    this.config = config;
  }

  async processNextMessage(): Promise<void> {
    const queueName = this.config.SQS_VIDEO_QUEUE_URL;

    const message = await this.messageQueue.get(queueName);
    if (!message) {
      return;
    }

    try {
      await this.process(message);
    } catch (e) {
      this.logger.error(`encountered an error when processing message '${message.id}': ${e}`);
    }

    await this.messageQueue.ack(message);
  }

  private async process(message: Message) {
    const data: any = JSON.parse(message.body);

    const srcVideo = data.srcVideo;
    if (!srcVideo) {
      throw new UnknownError(`message data missing 'srcVideo' property`);
    }

    const hlsUrl = data.hlsUrl;
    if (!hlsUrl) {
      throw new UnknownError(`message data missing 'hlsUrl' property`);
    }

    const notation = await this.notationService.findByVideoFilename(srcVideo);
    if (!notation) {
      throw new NotFoundError(`could not find notation from srcVideo: ${srcVideo}`);
    }

    await this.notationService.update(notation.id, { videoUrl: hlsUrl });
  }
}

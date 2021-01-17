import { NotFoundError, UnknownError } from '@stringsync/common';
import { inject, injectable } from '@stringsync/di';
import { Logger, Message, MessageQueue, UTIL_TYPES } from '@stringsync/util';
import { NotationService } from '../Notation';
import { ServicesConfig } from '../SERVICES_CONFIG';
import { SERVICES_TYPES } from '../SERVICES_TYPES';

const TYPES = { ...SERVICES_TYPES, ...UTIL_TYPES };

@injectable()
export class VideoUrlService {
  constructor(
    @inject(TYPES.Logger) public logger: Logger,
    @inject(TYPES.MessageQueue) public messageQueue: MessageQueue,
    @inject(TYPES.NotationService) public notationService: NotationService,
    @inject(TYPES.ServicesConfig) public config: ServicesConfig
  ) {}

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

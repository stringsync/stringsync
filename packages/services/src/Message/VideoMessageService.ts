import { NotFoundError, UnknownError } from '@stringsync/common';
import { ContainerConfig } from '@stringsync/config';
import { TYPES } from '@stringsync/di';
import { Logger, Message, MessageQueue } from '@stringsync/util';
import { inject, injectable } from 'inversify';
import path from 'path';
import { NotationService } from '../Notation';

@injectable()
export class VideoMessageService {
  logger: Logger;
  messageQueue: MessageQueue;
  notationService: NotationService;
  config: ContainerConfig;

  constructor(
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.MessageQueue) messageQueue: MessageQueue,
    @inject(TYPES.NotationService) notationService: NotationService,
    @inject(TYPES.ContainerConfig) config: ContainerConfig
  ) {
    this.logger = logger;
    this.messageQueue = messageQueue;
    this.notationService = notationService;
    this.config = config;
  }

  async call(): Promise<void> {
    const queueName = this.config.VIDEO_MESSAGE_QUEUE_NAME;

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

    const ext = path.extname(srcVideo);
    const notationId = path.basename(srcVideo, ext);
    const notation = await this.notationService.find(notationId);
    if (!notation) {
      throw new NotFoundError(`could not find notation ${notationId} from srcVideo: ${srcVideo}`);
    }

    await this.notationService.update(notation.id, { videoUrl: hlsUrl });
  }
}

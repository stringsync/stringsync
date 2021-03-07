import { inject, injectable } from 'inversify';
import { Config } from '../../config';
import { NotFoundError, UnknownError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { JSONObject, Logger, Message, MessageQueue } from '../../util';
import { NotationService } from '../Notation';

@injectable()
export class VideoUrlService {
  constructor(
    @inject(TYPES.Logger) public logger: Logger,
    @inject(TYPES.MessageQueue) public messageQueue: MessageQueue,
    @inject(TYPES.NotationService) public notationService: NotationService,
    @inject(TYPES.Config) public config: Config
  ) {}

  async processNextMessage(): Promise<void> {
    const queueUrl = this.config.SQS_VIDEO_QUEUE_URL;

    const message = await this.messageQueue.get(queueUrl);
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
    const data: JSONObject = JSON.parse(message.body);

    const srcVideo = data.srcVideo;
    if (!srcVideo) {
      throw new UnknownError(`message data missing 'srcVideo' property`);
    }
    if (typeof srcVideo !== 'string') {
      throw new UnknownError(`message data corrupt 'srcVideo' property must be a string`);
    }

    const hlsUrl = data.hlsUrl;
    if (!hlsUrl) {
      throw new UnknownError(`message data missing 'hlsUrl' property`);
    }
    if (typeof hlsUrl !== 'string') {
      throw new UnknownError(`message data corrupt 'hlsUrl' property must be a string`);
    }

    const notation = await this.notationService.findByVideoFilename(srcVideo);
    if (!notation) {
      throw new NotFoundError(`could not find notation from srcVideo: ${srcVideo}`);
    }

    await this.notationService.update(notation.id, { videoUrl: hlsUrl });
  }
}

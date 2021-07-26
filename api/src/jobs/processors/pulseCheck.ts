import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { Logger } from '../../util';
import { Processor } from '../types';

export type PulseCheckPayload = {};

export const pulseCheck: Processor<PulseCheckPayload> = async () => {
  const now = new Date();
  const logger = container.get<Logger>(TYPES.Logger);
  logger.info(`job pulse check: ${now.toISOString()}`);
};

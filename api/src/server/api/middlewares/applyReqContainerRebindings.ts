import { Container } from 'inversify';
import { TYPES } from '../../../inversify.constants';
import { Logger, LoggerMeta } from '../../../util';

/**
 * Allows inversify containers to have request-scoped containers.
 */
export const applyReqContainerRebindings = (reqContainer: Container, meta: LoggerMeta) => {
  const logger = reqContainer.get<Logger>(TYPES.Logger);
  logger.setMeta(meta);
  reqContainer.rebind<Logger>(TYPES.Logger).toConstantValue(logger);
};

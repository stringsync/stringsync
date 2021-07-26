import { Container } from 'inversify';
import { TYPES } from '../../../inversify.constants';
import { ctor, Logger, LoggerMeta } from '../../../util';

/**
 * Allows inversify containers to have request-scoped containers.
 */
export const applyReqContainerRebindings = (reqContainer: Container, meta: LoggerMeta) => {
  for (const [type, id] of Object.entries<symbol>(TYPES)) {
    if (type.endsWith('Loader')) {
      const loader = reqContainer.get(id);
      reqContainer
        .rebind(id)
        .to(ctor(loader))
        .inSingletonScope();
    }
  }

  const logger = reqContainer.get<Logger>(TYPES.Logger);
  logger.setMeta(meta);
  reqContainer.rebind<Logger>(TYPES.Logger).toConstantValue(logger);
};

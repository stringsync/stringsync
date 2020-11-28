import { configFactory } from './configFactory';
import { ConfigKind } from './types';

export const SIMPLE_CONFIG = configFactory({
  PORT: { kind: ConfigKind.INT, nullable: false },
});

export type SimpleConfig = ReturnType<typeof SIMPLE_CONFIG>;

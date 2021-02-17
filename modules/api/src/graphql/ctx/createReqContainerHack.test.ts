import { container } from '../../inversify.config';
import { createReqContainerHack } from './createReqContainerHack';

describe('createReqContainerHack', () => {
  it('runs without crashing', () => {
    expect(() => createReqContainerHack(container)).not.toThrow();
  });
});

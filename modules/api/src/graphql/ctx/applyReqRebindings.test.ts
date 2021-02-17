import { container } from '../../inversify.config';
import { applyReqRebindings } from './applyReqRebindings';

describe('applyReqRebindings', () => {
  it('runs without crashing', () => {
    expect(() => applyReqRebindings(container)).not.toThrow();
  });
});

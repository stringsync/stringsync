import { container } from '../inversify.config';
import { createReqCtx } from './createReqCtx';

describe('createReqCtx', () => {
  it('runs without crashing', () => {
    const req: any = {};
    const res: any = {};
    expect(() => createReqCtx(req, res, container)).not.toThrow();
  });
});

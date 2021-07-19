import { Ctx } from './Ctx';

describe('Ctx', () => {
  describe('constructor', () => {
    it('sets a unique reqId', () => {
      const ctx1 = new Ctx();
      const ctx2 = new Ctx();
      const reqId1 = ctx1.getReqId();
      const reqId2 = ctx2.getReqId();
      expect(reqId1).not.toBe(reqId2);
    });

    it('sets a reqAt', () => {
      const ctx = new Ctx();
      expect(() => ctx.getReqAt()).not.toThrow();
    });
  });
});

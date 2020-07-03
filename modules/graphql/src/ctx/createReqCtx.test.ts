import { useTestContainer } from '@stringsync/container';
import { createReqCtx } from './createReqCtx';

const container = useTestContainer();

it('runs without crashing', () => {
  const req: any = {};
  const res: any = {};
  expect(() => createReqCtx(req, res, container)).not.toThrow();
});

import { useTestContainer } from '@stringsync/di';
import { API } from '../API';
import { createReqCtx } from './createReqCtx';

const ref = useTestContainer(API);

it('runs without crashing', () => {
  const req: any = {};
  const res: any = {};
  expect(() => createReqCtx(req, res, ref.container)).not.toThrow();
});

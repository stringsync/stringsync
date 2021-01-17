import { useTestContainer } from '@stringsync/di';
import { API } from '../API';
import { applyReqRebindings } from './applyReqRebindings';

describe('applyReqRebindings', () => {
  const ref = useTestContainer(API);

  it('runs without crashing', () => {
    expect(() => applyReqRebindings(ref.container)).not.toThrow();
  });
});

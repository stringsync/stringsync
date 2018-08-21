import * as React from 'react';
import { Score } from './Score';
import { assertRender } from 'test';
import { VEXTAB_STRINGS } from 'test';
import { sample } from 'lodash';
import { getDefaultNotation } from 'data';

assertRender(() => {
  const notation = getDefaultNotation();
  notation.songName = 'foo';
  notation.artistName = 'bar';
  notation.vextabString = sample(VEXTAB_STRINGS) as string;

  return <Score editor={false} dynamic={true} width={640} notation={notation} />;
});

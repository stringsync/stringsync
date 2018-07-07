import * as React from 'react';
import { Score } from './Score';
import { assertRender } from 'test';
import { VEXTAB_STRINGS } from 'test';
import { sample } from 'lodash';

assertRender(() => (
  <Score
    vextabString={sample(VEXTAB_STRINGS) as string}
    width={640}
  />
));

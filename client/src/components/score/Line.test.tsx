import * as React from 'react';
import { Line } from './Line';
import { VEXTAB_STRINGS } from 'test/VEXTAB_STRINGS';
import { Vextab, Factory } from 'models';
import { assertRender } from 'test';
import { sample } from 'lodash';
import { Flow } from 'vexflow';

assertRender(() => {
  const staves = Vextab.decode(sample(VEXTAB_STRINGS) as string);
  const tuning = new Flow.Tuning();
  const factory = new Factory(staves, tuning, 1, 640);
  const vextab = factory.newInstance();

  return <Line editMode={true} vextab={vextab} line={vextab.lines[0]} />
});

import * as React from 'react';
import { Line } from './Line';
import { VEXTAB_STRINGS } from 'test/VEXTAB_STRINGS';
import { Vextab } from 'models';
import { assertRender } from 'test';
import { sample } from 'lodash';

const vextab = new Vextab(Vextab.decode(sample(VEXTAB_STRINGS) as string), 1);

assertRender(() => <Line vextab={vextab} line={vextab.lines[0]}/>);

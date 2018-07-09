import * as React from 'react';
import { ScoreLine } from './ScoreLine';
import { assertRender } from 'test';
import { Vextab, Line } from 'models';
import { VEXTAB_STRINGS } from 'test/VEXTAB_STRINGS';
import { sample } from 'lodash';

const vextab = new Vextab(Vextab.decode(sample(VEXTAB_STRINGS) as string), 1);

assertRender(() => <ScoreLine id="foo" vextab={vextab} line={vextab.lines[0]}/>);

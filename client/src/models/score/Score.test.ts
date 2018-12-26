import { Score } from './Score';
import { VEXTAB_STRINGS } from '../../test/VEXTAB_STRINGS';
import { VextabString } from '../vextab-string/VextabString';

VEXTAB_STRINGS.forEach((rawVextabString, ndx) => {
  const numMeasures = Math.ceil(Math.random() * 5);
  const vextabString = new VextabString(rawVextabString).asMeasures(numMeasures);

  it(`renders and hydrates VEXTAB_STRINGS '${ndx}' without crashing`, () => {
    const div = document.createElement('div');
    const score = new Score(640, div, vextabString);
    score.render();
    score.hydrate();
  });
});

import Score from './Score';
import { assertRender } from 'test';
import { Vextab } from 'services';

assertRender(() => <Score vextab={new Vextab([])} />);

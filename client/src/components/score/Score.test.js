import Score from './Score';
import { assertRender } from 'test';

assertRender(() => <Score measures={[]} measuresPerLine={1} />);

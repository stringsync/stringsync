import ScoreLine from './ScoreLine';
import { assertRender } from 'test';
import { Line } from 'models';

assertRender(() => <ScoreLine line={new Line([], 1)} />);

import { Vextab, Line } from 'models';

export const scoreKey = (vextab: Vextab, line: Line): string => `score-line-${line.index}-${vextab.id}`;

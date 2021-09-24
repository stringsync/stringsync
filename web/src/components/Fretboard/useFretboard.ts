import { Fretboard } from '@moonwave99/fretboard.js';
import { useEffect, useState } from 'react';
import { Tuning } from '../../lib/guitar/Tuning';
import { FretboardOptions } from './types';

export const useFretboard = (id: string, tuning: Tuning, opts: Partial<FretboardOptions>) => {
  const [fretboard, setFretboard] = useState(() => new Fretboard());

  useEffect(() => {
    const fretboard = new Fretboard({ el: `#${id}`, tuning: tuning.toFullyQualifiedStrings(), ...opts });
    setFretboard(fretboard);
    fretboard.render();
    return () => {
      fretboard.removeEventListeners();
      fretboard.clear();
    };
  }, [id, opts, tuning]);

  return fretboard;
};

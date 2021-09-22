import { Fretboard } from '@moonwave99/fretboard.js';
import { Options } from '@moonwave99/fretboard.js/dist/fretboard/Fretboard';
import { useEffect, useState } from 'react';
import { Tuning } from '../../lib/guitar/Tuning';

export type FretboardOptions = Partial<Omit<Options, 'el' | 'tuning'>>;

const NULL_FRETBOARD = new Fretboard();

export const useFretboard = (id: string, tuning: Tuning, opts: Partial<FretboardOptions>) => {
  const [fretboard, setFretboard] = useState(NULL_FRETBOARD);

  useEffect(() => {
    const fretboard = new Fretboard({ el: `#${id}`, tuning: tuning.toFullyQualifiedStrings(), ...opts });
    setFretboard(fretboard);
    fretboard.render();
    return () => {
      fretboard.removeEventListeners();
    };
  }, [id, opts, tuning]);

  return fretboard;
};

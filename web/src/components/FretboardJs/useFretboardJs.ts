import { Fretboard } from '@moonwave99/fretboard.js';
import { Options } from '@moonwave99/fretboard.js/dist/fretboard/Fretboard';
import { useEffect, useState } from 'react';

export type FretboardOptions = Partial<Omit<Options, 'el'>>;

const NULL_FRETBOARD = new Fretboard();

export const useFretboard = (id: string, opts: Partial<FretboardOptions>) => {
  const [fretboard, setFretboard] = useState(NULL_FRETBOARD);

  useEffect(() => {
    const fretboard = new Fretboard({ el: `#${id}`, ...opts });
    setFretboard(fretboard);
    fretboard.render();
    return () => {
      fretboard.removeEventListeners();
    };
  }, [id, opts]);

  return fretboard;
};

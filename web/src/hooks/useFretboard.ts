import { Fretboard } from '@moonwave99/fretboard.js';
import { RefObject, useEffect, useState } from 'react';
import { FretboardJsOptions } from '../lib/fretboard/types';
import { Tuning } from '../lib/guitar/Tuning';

export const useFretboard = (figureRef: RefObject<HTMLElement>, tuning: Tuning, opts: Partial<FretboardJsOptions>) => {
  const [fretboard, setFretboard] = useState(() => new Fretboard());

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) {
      return;
    }
    const fretboard = new Fretboard({ el: figure, tuning: tuning.toFullyQualifiedStrings(), ...opts });
    setFretboard(fretboard);
    fretboard.render();
    return () => {
      fretboard.removeEventListeners();
      fretboard.clear();
      figure && Array.from(figure.children).forEach((child) => child.remove());
    };
  }, [figureRef, opts, tuning]);

  return fretboard;
};

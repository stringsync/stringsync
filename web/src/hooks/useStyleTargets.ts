import { Fretboard } from '@moonwave99/fretboard.js';
import equal from 'fast-deep-equal/react';
import React, { useEffect, useState } from 'react';
import * as fretboard from '../lib/fretboard';

export const useStyleTargets = (
  fb: Fretboard,
  children: React.ReactNode,
  styleMergeStrategy: fretboard.MergeStrategy
) => {
  const [positionStyleTargets, setPositionStyleTargets] = useState<fretboard.PositionStyleTarget[]>([]);
  const [slideStyleTargets, setSlideStyleTargets] = useState<fretboard.SlideStyleTarget[]>([]);

  useEffect(() => {
    const nextStyleTargets = fretboard.getStyleTargets(fb, children, styleMergeStrategy);

    const nextPositionStyleTargets = nextStyleTargets.filter(fretboard.isPositionStyleTarget);
    setPositionStyleTargets((currentPositionStyleTargets) => {
      return equal(currentPositionStyleTargets, nextPositionStyleTargets)
        ? currentPositionStyleTargets
        : nextPositionStyleTargets;
    });

    const nextSlideStyleTargets = nextStyleTargets.filter(fretboard.isSlideStyleTarget);
    setSlideStyleTargets((currentSlideStyleTargets) => {
      return equal(currentSlideStyleTargets, nextSlideStyleTargets) ? currentSlideStyleTargets : nextSlideStyleTargets;
    });
  }, [fb, children, styleMergeStrategy]);

  return { positionStyleTargets, slideStyleTargets };
};

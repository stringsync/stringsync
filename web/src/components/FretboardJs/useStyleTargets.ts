import { Fretboard } from '@moonwave99/fretboard.js';
import equal from 'fast-deep-equal/react';
import React, { useEffect, useState } from 'react';
import * as helpers from './helpers';
import { MergeStrategy, PositionStyleTarget, SlideStyleTarget } from './types';

export const useStyleTargets = (fretboard: Fretboard, children: React.ReactNode, styleMergeStrategy: MergeStrategy) => {
  const [positionStyleTargets, setPositionStyleTargets] = useState<PositionStyleTarget[]>([]);
  const [slideStyleTargets, setSlideStyleTargets] = useState<SlideStyleTarget[]>([]);

  useEffect(() => {
    const nextStyleTargets = helpers.getStyleTargets(fretboard, children, styleMergeStrategy);

    const nextPositionStyleTargets = nextStyleTargets.filter(helpers.isPositionStyleTarget);
    setPositionStyleTargets((currentPositionStyleTargets) => {
      return equal(currentPositionStyleTargets, nextPositionStyleTargets)
        ? currentPositionStyleTargets
        : nextPositionStyleTargets;
    });

    const nextSlideStyleTargets = nextStyleTargets.filter(helpers.isSlideStyleTarget);
    setSlideStyleTargets((currentSlideStyleTargets) => {
      return equal(currentSlideStyleTargets, nextSlideStyleTargets) ? currentSlideStyleTargets : nextSlideStyleTargets;
    });
  }, [fretboard, children, styleMergeStrategy]);

  return { positionStyleTargets, slideStyleTargets };
};

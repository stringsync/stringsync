import { Fretboard } from '@moonwave99/fretboard.js';
import React, { useEffect, useState } from 'react';
import * as fretboard from '../lib/fretboard';
import { useMemoCmp } from './useMemoCmp';

export const useStyleTargets = (
  fb: Fretboard,
  children: React.ReactNode,
  styleMergeStrategy: fretboard.MergeStrategy
) => {
  const [positions, setPositions] = useState<fretboard.PositionStyleTarget[]>([]);
  const [slides, setSlides] = useState<fretboard.SlideStyleTarget[]>([]);
  const [hammerOns, setHammerOns] = useState<fretboard.HammerOnStyleTarget[]>([]);
  const [pullOffs, setPullOffs] = useState<fretboard.PullOffStyleTarget[]>([]);

  useEffect(() => {
    const nextStyleTargets = fretboard.getStyleTargets(fb, children, styleMergeStrategy);

    // positions
    const nextPositions = nextStyleTargets.filter(fretboard.isPositionStyleTarget);
    setPositions(nextPositions);

    // slides
    const nextSlides = nextStyleTargets.filter(fretboard.isSlideStyleTarget);
    setSlides(nextSlides);

    // hammer-ons
    const nextHammerOns = nextStyleTargets.filter(fretboard.isHammerOnStyleTarget);
    setHammerOns(nextHammerOns);

    // pull-offs
    const nextPullOffs = nextStyleTargets.filter(fretboard.isPullOffStyleTarget);
    setPullOffs(nextPullOffs);
  }, [fb, children, styleMergeStrategy]);

  return useMemoCmp({ positions, slides, hammerOns, pullOffs });
};

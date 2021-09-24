import { Fretboard } from '@moonwave99/fretboard.js';
import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import * as helpers from './helpers';
import { MergeStrategy, StyleTarget } from './types';

export const useStyleTargets = (fretboard: Fretboard, children: React.ReactNode, styleMergeStrategy: MergeStrategy) => {
  const [styleTargets, setStyleTargets] = useState<StyleTarget[]>([]);

  useEffect(() => {
    const nextStyleTargets = helpers.getStyleTargets(fretboard, children, styleMergeStrategy);

    setStyleTargets((currentStyleTargets) => {
      // Prevent unecessary renders by maintaining the same styleTargets object in memory if it hasn't changed.
      return isEqual(currentStyleTargets, nextStyleTargets) ? currentStyleTargets : nextStyleTargets;
    });
  }, [fretboard, children]);

  return styleTargets;
};

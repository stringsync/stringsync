import { first } from 'lodash';
import { ViewportState } from '../../ctx/viewport';
import { InternalError } from '../../errors';
import * as constants from './constants';
import { NotationLayout, NotationLayoutOptions } from './types';

const ALL_LAYOUTS: NotationLayout[] = ['sidecar', 'theater'];

export const getLayout = (opts: NotationLayoutOptions = {}): NotationLayout => {
  const preferredLayout = opts.preferred || null;
  const permittedLayouts = opts.permitted || ALL_LAYOUTS;
  const defaultLayout = opts.default || first(permittedLayouts);

  if (permittedLayouts.length === 0) {
    throw new InternalError('must permit at least 1 layout');
  }
  if (!defaultLayout) {
    throw new InternalError('must have a default layout');
  }
  if (!permittedLayouts.includes(defaultLayout)) {
    throw new InternalError(`permitted layouts must be unspecified or explicitly include: ${defaultLayout}`);
  }

  if (preferredLayout && permittedLayouts.includes(preferredLayout)) {
    return preferredLayout;
  }
  return defaultLayout;
};

export const getLayoutSizeBoundsPx = (viewport: ViewportState) => {
  const minSidecarWidthPx = constants.MIN_SIDECAR_WIDTH_PX;
  const maxSidecarWidthPx = Math.min(
    constants.MAX_SIDECAR_WIDTH_PX,
    constants.MAX_SIDECAR_WIDTH_FRAC * viewport.innerWidth
  );

  const minTheaterHeightPx = constants.MIN_THEATER_HEIGHT_PX;
  const maxTheaterHeightPx = Math.min(
    constants.MAX_THEATER_HEIGHT_PX,
    viewport.innerHeight - constants.MIN_NOTATION_HEIGHT_PX
  );

  return {
    sidecar: {
      min: minSidecarWidthPx,
      max: maxSidecarWidthPx,
    },
    theater: {
      min: minTheaterHeightPx,
      max: maxTheaterHeightPx,
    },
  };
};

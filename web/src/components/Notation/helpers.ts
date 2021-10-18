import { first } from 'lodash';
import { NotationLayoutOptions } from '.';
import { Device } from '../../ctx/device';
import { ViewportState } from '../../ctx/viewport';
import { InternalError } from '../../errors';
import * as constants from './constants';
import { CONTROLS_HEIGHT_PX } from './Controls';
import { FretMarkerDisplay, NotationLayout, NotationSettings, ScaleSelectionType } from './types';

const ALL_LAYOUTS: NotationLayout[] = ['sidecar', 'theater'];

export const getLayout = (opts: Partial<NotationLayoutOptions> = {}): NotationLayout => {
  const permitted = opts.permitted || ALL_LAYOUTS;
  const target = opts.target || first(permitted) || null;

  if (!target) {
    throw new InternalError('could not get layout');
  }
  if (permitted.length === 0) {
    throw new InternalError('must permit at least 1 layout');
  }
  if (!permitted.includes(target)) {
    throw new InternalError(`permitted layouts must be unspecified or explicitly include: ${target}`);
  }

  return target;
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
    viewport.innerHeight - constants.MIN_NOTATION_HEIGHT_PX - CONTROLS_HEIGHT_PX
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

export const getDefaultSettings = (device: Device): NotationSettings => ({
  preferredLayout: 'sidecar',
  isFretboardVisible: !device.mobile,
  fretMarkerDisplay: FretMarkerDisplay.None,
  isAutoScrollPreferred: true,
  isVideoVisible: true,
  scaleSelectionType: ScaleSelectionType.None,
  selectedScale: null,
  isLoopActive: false,
});

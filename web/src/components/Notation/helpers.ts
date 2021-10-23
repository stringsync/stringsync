import { first } from 'lodash';
import { NotationLayoutOptions } from '.';
import { Device } from '../../ctx/device';
import { ViewportState } from '../../ctx/viewport';
import { InternalError } from '../../errors';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { KeyInfo } from '../../lib/MusicDisplay/helpers';
import { SupportedSVGEventNames } from '../../lib/MusicDisplay/svg';
import * as constants from './constants';
import { FretMarkerDisplay, NotationLayout, NotationSettings, ScaleSelectionType } from './types';

const ALL_LAYOUTS: NotationLayout[] = ['sidecar', 'theater'];
const MOUSE_SVG_EVENT_NAMES: SupportedSVGEventNames[] = ['mousedown', 'mousemove', 'mouseup'];
const TOUCH_SVG_EVENT_NAMES: SupportedSVGEventNames[] = ['touchstart', 'touchmove', 'touchend'];

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

export const getLayoutSizeBoundsPx = (viewport: ViewportState, offsetHeightPx: number) => {
  const minSidecarWidthPx = constants.MIN_SIDECAR_WIDTH_PX;
  const maxSidecarWidthPx = Math.min(
    constants.MAX_SIDECAR_WIDTH_PX,
    constants.MAX_SIDECAR_WIDTH_FRAC * viewport.innerWidth
  );

  const minTheaterHeightPx = constants.MIN_THEATER_HEIGHT_PX;
  const maxTheaterHeightPx = Math.min(
    constants.MAX_THEATER_HEIGHT_PX,
    viewport.innerHeight - constants.MIN_NOTATION_HEIGHT_PX - offsetHeightPx
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
  isAutoscrollPreferred: true,
  isVideoVisible: true,
  scaleSelectionType: ScaleSelectionType.None,
  selectedScale: null,
  isLoopActive: false,
  defaultTheaterHeightPx: constants.MIN_THEATER_HEIGHT_PX,
  defaultSidecarWidthPx: 480,
});

export const getKeyInfo = (musicDisplay: MusicDisplay): KeyInfo | null => {
  if (!musicDisplay) {
    return null;
  }
  return (
    musicDisplay.getCursor().cursorSnapshot?.getKeyInfo() ||
    first(musicDisplay.getMeta().cursorSnapshots)?.getKeyInfo() ||
    null
  );
};

export const getSvgEventNames = (device: Device): SupportedSVGEventNames[] => {
  switch (device.inputType) {
    case 'mouseOnly':
      return [...MOUSE_SVG_EVENT_NAMES];
    case 'touchOnly':
      return [...TOUCH_SVG_EVENT_NAMES];
    case 'hybrid':
      return [...MOUSE_SVG_EVENT_NAMES, ...TOUCH_SVG_EVENT_NAMES];
  }
};

import React, { ReactNode } from 'react';
import { useDevice } from '../ctx/device';
import { useViewport } from '../ctx/viewport';
import { SlidingWindow } from './SlidingWindow';

const MIN_SIDECAR_WIDTH = 400;
const MAX_SIDECAR_WIDTH = 1000;
const MIN_THEATER_HEIGHT = 100;
const MAX_THEATER_HEIGHT = 800;

type SlideEndCallback = (size: number) => void;

export type SplitPaneLayoutType = 'sidecar' | 'theater';

export type SplitPaneLayoutProps = {
  pane1Content?: ReactNode;
  pane1Supplements?: ReactNode;
  pane1DefaultWidth?: number;
  pane1DefaultHeight?: number;
  pane2Content?: ReactNode;
  pane2Supplements?: ReactNode;
  preferredLayoutType?: SplitPaneLayoutType;
  onHorizontalSlideEnd?: SlideEndCallback;
  onVerticalSlideEnd?: SlideEndCallback;
};

/**
 * A responsive sliding window that switches between a sidecar and theater mode based on the device and viewport.
 */
export const SplitPaneLayout: React.FC<SplitPaneLayoutProps> = (props) => {
  const device = useDevice();
  const viewport = useViewport();
  const isCompact = device.mobile || viewport.xs || viewport.sm || viewport.md;
  const preferredLayoutType = props.preferredLayoutType || 'sidecar';
  const layoutType = isCompact ? 'theater' : preferredLayoutType;

  switch (layoutType) {
    case 'sidecar':
      return <SidecarLayout {...props} />;
    case 'theater':
      return <TheaterLayout {...props} />;
  }
};

const SidecarLayout: React.FC<SplitPaneLayoutProps> = (props) => {
  return (
    <SlidingWindow
      split="vertical"
      defaultSize={props.pane1DefaultWidth}
      minSize={MIN_SIDECAR_WIDTH}
      maxSize={MAX_SIDECAR_WIDTH}
      onSlideEnd={props.onVerticalSlideEnd}
      dividerZIndexOffset={1}
    >
      <div data-testid="pane1">
        {props.pane1Content}
        {props.pane1Supplements}
      </div>
      <div data-testid="pane2">
        {props.pane2Content}
        {props.pane2Supplements}
      </div>
    </SlidingWindow>
  );
};

const TheaterLayout: React.FC<SplitPaneLayoutProps> = (props) => {
  return (
    <SlidingWindow
      split="horizontal"
      defaultSize={props.pane1DefaultWidth}
      minSize={MIN_THEATER_HEIGHT}
      maxSize={MAX_THEATER_HEIGHT}
      onSlideEnd={props.onHorizontalSlideEnd}
      dividerZIndexOffset={1}
    >
      <div data-testid="pane1">
        {props.pane1Content}
        {props.pane1Supplements}
      </div>
      <div data-testid="pane2">
        {props.pane2Content}
        {props.pane2Supplements}
      </div>
    </SlidingWindow>
  );
};

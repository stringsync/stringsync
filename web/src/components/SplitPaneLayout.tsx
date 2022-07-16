import { Drawer } from 'antd';
import { noop } from 'lodash';
import React, { CSSProperties, ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import { useDevice } from '../ctx/device';
import { useViewport } from '../ctx/viewport';
import { SplitPane } from './SplitPane';

const MIN_SIDECAR_WIDTH = 400;
const MAX_SIDECAR_WIDTH = 1000;
const MIN_THEATER_HEIGHT = 100;
const MAX_THEATER_HEIGHT = 800;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

type SlideEndCallback = (size: number) => void;

type LayoutTypeChangeCallback = (layoutType: SplitPaneLayoutType) => void;

export type SplitPaneLayoutType = 'sidecar' | 'theater';

export type SplitPaneLayoutProps = {
  pane1Content?: ReactNode;
  pane1Supplements?: ReactNode;
  pane1DefaultWidth?: number;
  pane1DefaultHeight?: number;
  pane1Style?: CSSProperties;
  pane2Content?: ReactNode;
  pane2Supplements?: ReactNode;
  preferredLayoutType?: SplitPaneLayoutType;
  onHorizontalSlideEnd?: SlideEndCallback;
  onVerticalSlideEnd?: SlideEndCallback;
  onLayoutTypeChange?: LayoutTypeChangeCallback;
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

  const onLayoutTypeChange = props.onLayoutTypeChange || noop;
  useEffect(() => {
    onLayoutTypeChange(layoutType);
  }, [layoutType, onLayoutTypeChange]);

  switch (layoutType) {
    case 'sidecar':
      return <SidecarLayout {...props} />;
    case 'theater':
      return <TheaterLayout {...props} />;
  }
};

const SidecarLayout: React.FC<SplitPaneLayoutProps> = (props) => {
  return (
    <SplitPane
      split="vertical"
      pane1Style={props.pane1Style}
      defaultSize={props.pane1DefaultWidth}
      minSize={MIN_SIDECAR_WIDTH}
      maxSize={MAX_SIDECAR_WIDTH}
      onSlideEnd={props.onVerticalSlideEnd}
      dividerZIndexOffset={1}
      pane1Content={
        <FlexColumn>
          {props.pane1Content}
          {props.pane1Supplements}
        </FlexColumn>
      }
      pane2Content={
        <FlexColumn>
          {props.pane2Content}
          {props.pane2Supplements}
        </FlexColumn>
      }
    />
  );
};

const TheaterLayout: React.FC<SplitPaneLayoutProps> = (props) => {
  return (
    <>
      <SplitPane
        split="horizontal"
        pane1Style={props.pane1Style}
        defaultSize={props.pane1DefaultWidth}
        minSize={MIN_THEATER_HEIGHT}
        maxSize={MAX_THEATER_HEIGHT}
        onSlideEnd={props.onHorizontalSlideEnd}
        dividerZIndexOffset={1}
        pane1Content={props.pane1Content}
        pane2Content={
          <FlexColumn>
            {props.pane2Content}
            {props.pane2Supplements}
          </FlexColumn>
        }
      />
      <Drawer closable mask={false} width="100%">
        {props.pane1Supplements}
      </Drawer>
    </>
  );
};

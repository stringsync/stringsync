import { DoubleRightOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import { noop } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { useDevice } from '../../ctx/device';
import { useViewport } from '../../ctx/viewport/useViewport';
import { useMemoCmp } from '../../hooks/useMemoCmp';
import { MusicDisplay as MusicDisplayBackend } from '../../lib/MusicDisplay';
import { Nullable } from '../../util/types';
import { Controls } from './Controls';
import * as helpers from './helpers';
import { Media } from './Media';
import { MusicDisplay } from './MusicDisplay';
import { Sidecar } from './Sidecar';
import { SplitPane } from './SplitPane';
import { NotationLayoutOptions, NotationSettings, RenderableNotation } from './types';

const NOTATION_DETAIL_THRESHOLD_PX = 767;

const FloatingButton = styled(Button)<{ $top: number }>`
  position: fixed;
  top: ${(props) => props.$top}px;
  right: -1px;
  z-index: 3;
`;

const Flex1 = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
`;

const FlexColumn = styled.div<{ $height: number }>`
  display: flex;
  flex-direction: column;
  transition: height 200ms;
  height: ${(props) => props.$height}px;
`;

type Props = {
  loading?: boolean;
  sidecar?: React.ReactNode;
  layoutOptions?: NotationLayoutOptions;
  notation: Nullable<RenderableNotation>;
  defaultSettings?: Partial<NotationSettings>;
  onSettingsChange?: (settings: NotationSettings) => void;
};

export const Notation: React.FC<Props> = (props) => {
  // props
  const loading = props.loading || false;
  const notation = props.notation;
  const layoutOptions = props.layoutOptions;
  const sidecar = props.sidecar;
  const src = notation?.videoUrl || null;
  const defaultSettings = useMemoCmp(props.defaultSettings);
  const onSettingsChange = props.onSettingsChange || noop;

  // settings
  const device = useDevice();
  const [settings, setSettings] = useState<NotationSettings>(() => ({
    ...helpers.getDefaultSettings(device),
    ...defaultSettings,
  }));
  useEffect(() => {
    onSettingsChange(settings);
  }, [onSettingsChange, settings]);

  // layout
  const isPreferredLayoutPermitted = layoutOptions?.permitted.includes(settings.preferredLayout) || false;
  const layout = isPreferredLayoutPermitted ? settings.preferredLayout : helpers.getLayout(layoutOptions);

  // split pane sizing
  const viewport = useViewport();
  const layoutSizeBoundsPx = helpers.getLayoutSizeBoundsPx(viewport);
  const [pane1Dimensions, setPane1Dimensions] = useState({ width: 0, height: 0 });
  const pane2Height = viewport.innerHeight - pane1Dimensions.height;
  const pane2Width = viewport.innerWidth - pane1Dimensions.width;

  // sidecar drawer button
  const [isSidecarDrawerVisible, setSidecarDrawerVisibility] = useState(false);
  const onOpenSidecarDrawerButtonClick = () => setSidecarDrawerVisibility(true);
  const onSidecarDrawerCloseClick = () => setSidecarDrawerVisibility(false);

  // home button
  const history = useHistory();
  const onHomeClick = () => history.push('/library');

  // music display
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplayBackend | null>(null);
  useEffect(() => {
    musicDisplay?.resize();
  }, [musicDisplay, pane2Width]);

  // controls detail
  const showDetail = pane2Width > NOTATION_DETAIL_THRESHOLD_PX;

  return (
    <div data-testid="notation">
      {layout === 'sidecar' && (
        <>
          <SplitPane
            split="vertical"
            minSize={layoutSizeBoundsPx.sidecar.min}
            maxSize={layoutSizeBoundsPx.sidecar.max}
            pane2Style={{ width: '100%' }}
            onPane1Resize={setPane1Dimensions}
          >
            <Sidecar videoSkeleton loading={loading}>
              <Media video loading={loading} src={src} />
              {sidecar}
            </Sidecar>
            <FlexColumn $height={viewport.innerHeight}>
              <Flex1>
                <MusicDisplay loading={loading} notation={notation} onMusicDisplayChange={setMusicDisplay} />
              </Flex1>
              <Controls showDetail={showDetail} notation={notation} settings={settings} setSettings={setSettings} />
            </FlexColumn>
          </SplitPane>
        </>
      )}

      {layout === 'theater' && (
        <>
          <FloatingButton $top={16} size="large" type="primary" icon={<HomeOutlined />} onClick={onHomeClick} />
          <FloatingButton
            $top={72}
            size="large"
            type="primary"
            icon={<DoubleRightOutlined />}
            onClick={onOpenSidecarDrawerButtonClick}
          />
          <Drawer closable visible={isSidecarDrawerVisible} width="100%" onClose={onSidecarDrawerCloseClick}>
            <Sidecar loading={loading}>
              <div>video</div>
            </Sidecar>
          </Drawer>

          {settings.isVideoVisible && (
            <SplitPane
              split="horizontal"
              style={{ position: 'static' }}
              minSize={layoutSizeBoundsPx.theater.min}
              maxSize={layoutSizeBoundsPx.theater.max}
              onPane1Resize={setPane1Dimensions}
            >
              <Media video fluid={false} loading={loading} src={src} />
              <FlexColumn $height={pane2Height}>
                <Flex1>
                  <MusicDisplay loading={loading} notation={notation} onMusicDisplayChange={setMusicDisplay} />
                </Flex1>
                <Controls showDetail={showDetail} notation={notation} settings={settings} setSettings={setSettings} />
              </FlexColumn>
            </SplitPane>
          )}

          {!settings.isVideoVisible && <div>TODO</div>}
        </>
      )}
    </div>
  );
};

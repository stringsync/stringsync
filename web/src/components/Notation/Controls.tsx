import { PauseOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Row, Slider } from 'antd';
import { identity, noop } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import { Nullable } from '../../util/types';
import { Detail } from './Detail';
import { NotationSettings, RenderableNotation } from './types';

export const CONTROLS_HEIGHT_PX = 72;

const Outer = styled.div`
  border-top: 1px solid ${(props) => props.theme['@border-color']};
  height: ${CONTROLS_HEIGHT_PX}px;
  padding: 0 16px;
`;

const SliderOuter = styled.div`
  padding: 0 16px 0 16px;
  width: 100%;

  .ant-slider-with-marks {
    margin: inherit;
  }
`;

const FullHeightRow = styled(Row)`
  height: 100%;
`;

const StyledButton = styled(Button)`
  color: ${(props) => props.theme['@muted']};
  border: none;
`;

const SettingsInner = styled.div`
  overflow-y: auto;
  /* offset the control bar so the */
  height: calc(100vh - 190px);
`;

const FloatingAlert = styled(Alert)`
  position: fixed;
  z-index: 5;
  bottom: 80px;
  right: 24px;
`;

type Props = {
  showDetail: boolean;
  notation: Nullable<RenderableNotation>;
  settings: NotationSettings;
  setSettings(settings: NotationSettings): void;
};

export const Controls: React.FC<Props> = (props) => {
  // props
  const showDetail = props.showDetail;
  const settings = props.settings;
  const notation = props.notation;

  // state
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  // callbacks
  const onSettingsClick = () => {
    setIsSettingsVisible((currentIsSettingsVisible) => !currentIsSettingsVisible);
  };

  // tmp
  const isNoopScrolling = false;
  const isPlaying = false;
  const isPaused = true;
  const onAutoscrollDisabledClose = noop;
  const marks = undefined;
  const videoPlayerControls = { play: noop, pause: noop };
  const handleStyle = {};
  const value = 0;
  const tipFormatter = identity;
  const onChange = noop;
  const onAfterChange = noop;

  return (
    <Outer data-testid="controls">
      {isNoopScrolling && settings.isAutoscrollPreferred && isPlaying && (
        <FloatingAlert
          showIcon
          closable
          closeText="enable"
          onClose={onAutoscrollDisabledClose}
          type="warning"
          message="autoscroll temporarily disabled"
        />
      )}
      <FullHeightRow justify="center" align="middle">
        <Col span={showDetail ? 1 : 2}>
          <FullHeightRow justify="center" align="middle">
            {isPaused ? (
              <StyledButton size="large" shape="circle" icon={<RightOutlined />} onClick={videoPlayerControls.play} />
            ) : (
              <StyledButton size="large" shape="circle" icon={<PauseOutlined />} onClick={videoPlayerControls.pause} />
            )}
          </FullHeightRow>
        </Col>
        <Col span={20}>
          <FullHeightRow justify="center" align="middle">
            <SliderOuter>
              <Slider
                step={0.01}
                marks={marks}
                handleStyle={handleStyle}
                value={value}
                tipFormatter={tipFormatter}
                onChange={onChange}
                onAfterChange={onAfterChange}
              />
            </SliderOuter>
          </FullHeightRow>
        </Col>
        <Col span={showDetail ? 1 : 2}>
          <FullHeightRow justify="center" align="middle">
            <StyledButton size="large" shape="circle" icon={<SettingOutlined />} onClick={onSettingsClick} />
          </FullHeightRow>
        </Col>
        <Col span={showDetail ? 2 : 0}>
          <FullHeightRow justify="center" align="middle">
            <Detail
              thumbnailUrl={notation?.thumbnailUrl || ''}
              artistName={notation?.artistName || '???'}
              songName={notation?.songName || '???'}
            />
          </FullHeightRow>
        </Col>
      </FullHeightRow>
    </Outer>
  );
};

import { InfoCircleOutlined, PauseOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Divider, Drawer, Radio, RadioChangeEvent, Row, Select, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxOptionType, CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { useCallback, useEffect, useId, useState } from 'react';
import styled from 'styled-components';
import { useDevice } from '../ctx/device';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { useScales } from '../hooks/useScales';
import { MediaPlayer, PlayState } from '../lib/MediaPlayer';
import { MusicDisplay } from '../lib/MusicDisplay';
import { DisplayMode } from '../lib/musicxml';
import * as notations from '../lib/notations';
import { Nullable } from '../util/types';
import { Detail } from './Detail';
import { Playback } from './Playback';
import { Seekbar } from './Seekbar';

export const CONTROLS_HEIGHT_PX = 75;
const NOTATION_DETAIL_THRESHOLD_PX = 767;

const Outer = styled.div`
  border: 1px solid ${(props) => props.theme['@border-color']};
  border-bottom: 0;
  height: ${CONTROLS_HEIGHT_PX}px;
  padding: 0 16px;
  background-color: white;
  box-sizing: border-box;
  overflow: hidden;
`;

const FullHeightRow = styled(Row)`
  height: 100%;
`;

const StyledButton = styled(Button)`
  color: ${(props) => props.theme['@muted']};
  border: none;
  box-shadow: none;
  background-color: transparent;
`;

const RotationButton = styled(StyledButton)<{ $rotateDeg: number }>`
  .anticon svg {
    transition: transform 0.3s;
    transform: rotate(${(props) => props.$rotateDeg}deg);
    transform-origin: center;
  }
`;

const SettingsInner = styled.div`
  overflow-y: auto;
  height: calc(100% - ${CONTROLS_HEIGHT_PX}px);

  ::-webkit-scrollbar {
    display: none;
  }
`;

type Props = {
  videoControls: boolean;
  notation: Nullable<notations.RenderableNotation>;
  musicDisplay: MusicDisplay;
  mediaPlayer: MediaPlayer;
  settings: notations.Settings;
  setSettings(settings: notations.Settings): void;
  settingsContainer?: HTMLElement | false;
};

export const Controls: React.FC<Props> = (props) => {
  // props
  const settings = props.settings;
  const notation = props.notation;
  const musicDisplay = props.musicDisplay;
  const mediaPlayer = props.mediaPlayer;
  const setSettings = props.setSettings;
  const videoControls = props.videoControls;
  const settingsContainer = props.settingsContainer ?? false;

  // state
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const device = useDevice();

  // show detail
  const idPrefix = useId();
  const outerId = `${idPrefix}-outer`;
  const [showDetail, setShowDetail] = useState(false);
  const onOuterResize = useCallback((entries: ResizeObserverEntry[]) => {
    const nextShowDetail = entries[0].contentRect.width >= NOTATION_DETAIL_THRESHOLD_PX;
    setShowDetail(nextShowDetail);
  }, []);
  useResizeObserver(outerId, onOuterResize);

  // callbacks
  const onSettingsClick = () => {
    setIsSettingsVisible((currentIsSettingsVisible) => !currentIsSettingsVisible);
  };
  const onSettingsClose = () => {
    setIsSettingsVisible(false);
  };

  // scales
  const scales = useScales(musicDisplay);

  // settings
  const onVideoVisibilityChange = (event: CheckboxChangeEvent) => {
    setSettings({ ...settings, isVideoVisible: event.target.checked });
  };
  const onFretboardVisibilityChange = (event: CheckboxChangeEvent) => {
    setSettings({ ...settings, isFretboardVisible: event.target.checked });
  };
  const onFretMarkerDisplayChange = (event: RadioChangeEvent) => {
    setSettings({ ...settings, fretMarkerDisplay: event.target.value });
  };
  const onSelectedScaleChange = (value: string) => {
    switch (value) {
      case 'none':
        setSettings({ ...settings, scaleSelectionType: notations.ScaleSelectionType.None, selectedScale: null });
        break;
      case 'dynamic':
        setSettings({ ...settings, scaleSelectionType: notations.ScaleSelectionType.Dynamic });
        break;
      default:
        setSettings({ ...settings, scaleSelectionType: notations.ScaleSelectionType.User, selectedScale: value });
    }
  };
  const onAutoscrollPreferenceChange = (event: CheckboxChangeEvent) => {
    setSettings({ ...settings, isAutoscrollPreferred: event.target.checked });
  };
  const onIsLoopActiveChange = (event: CheckboxChangeEvent) => {
    setSettings({ ...settings, isLoopActive: event.target.checked });
  };

  // display mode settings
  const onDisplayModeChange = (values: CheckboxValueType[]) => {
    if (values.contains('notes') && values.contains('tabs')) {
      setSettings({ ...settings, displayMode: DisplayMode.NotesAndTabs });
    } else if (values.contains('notes')) {
      setSettings({ ...settings, displayMode: DisplayMode.NotesOnly });
    } else if (values.contains('tabs')) {
      setSettings({ ...settings, displayMode: DisplayMode.TabsOnly });
    } else {
      setSettings({ ...settings, displayMode: DisplayMode.TabsOnly });
    }
  };
  let displayModeOptions = new Array<CheckboxOptionType>();
  let displayModeCheckboxValues = new Array<string>();
  switch (settings.displayMode) {
    case DisplayMode.TabsOnly:
      displayModeOptions = [
        { label: 'tabs', value: 'tabs', disabled: true },
        { label: 'notes', value: 'notes', disabled: false },
      ];
      displayModeCheckboxValues = ['tabs'];
      break;
    case DisplayMode.NotesOnly:
      displayModeOptions = [
        { label: 'tabs', value: 'tabs', disabled: false },
        { label: 'notes', value: 'notes', disabled: true },
      ];
      displayModeCheckboxValues = ['notes'];
      break;
    case DisplayMode.NotesAndTabs:
      displayModeOptions = [
        { label: 'tabs', value: 'tabs', disabled: false },
        { label: 'notes', value: 'notes', disabled: false },
      ];
      displayModeCheckboxValues = ['tabs', 'notes'];
      break;
  }

  // video player state
  const [playState, setPlayState] = useState(() => mediaPlayer.getPlayState());
  const isPaused = playState === PlayState.Paused;
  useEffect(() => {
    const eventBusIds = [
      mediaPlayer.eventBus.subscribe('init', () => {
        setPlayState(mediaPlayer.getPlayState());
      }),
      mediaPlayer.eventBus.subscribe('playstatechange', (payload) => {
        setPlayState(payload.playState);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...eventBusIds);
    };
  }, [mediaPlayer]);

  return (
    <Outer data-testid="controls" id={outerId}>
      <FullHeightRow justify="center" align="middle">
        <Col span={2}>
          <FullHeightRow justify="center" align="middle">
            {isPaused ? (
              <StyledButton size="large" shape="circle" icon={<RightOutlined />} onClick={mediaPlayer.play} />
            ) : (
              <StyledButton size="large" shape="circle" icon={<PauseOutlined />} onClick={mediaPlayer.pause} />
            )}
          </FullHeightRow>
        </Col>

        <Col span={showDetail ? 18 : 20}>
          <FullHeightRow justify="center" align="middle">
            <Seekbar notation={notation} musicDisplay={musicDisplay} mediaPlayer={mediaPlayer} />
          </FullHeightRow>
        </Col>

        <Col span={2}>
          <FullHeightRow justify="center" align="middle">
            <RotationButton
              size="large"
              shape="circle"
              icon={<SettingOutlined />}
              onClick={onSettingsClick}
              $rotateDeg={isSettingsVisible ? 90 : 0}
            />
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

      <Drawer
        title="settings"
        placement="right"
        keyboard
        width={device.mobile ? 278 : undefined}
        closable={false}
        visible={isSettingsVisible}
        onClose={onSettingsClose}
        getContainer={settingsContainer}
        zIndex={3}
      >
        <SettingsInner>
          {videoControls && (
            <>
              <Checkbox checked={settings.isVideoVisible} onChange={onVideoVisibilityChange}>
                video
              </Checkbox>

              <Divider />
            </>
          )}

          <Checkbox checked={settings.isFretboardVisible} onChange={onFretboardVisibilityChange}>
            fretboard
          </Checkbox>

          <br />
          <br />

          <h5>labels</h5>
          <Radio.Group optionType="button" value={settings.fretMarkerDisplay} onChange={onFretMarkerDisplayChange}>
            <Radio.Button value={notations.FretMarkerDisplay.None}>none</Radio.Button>
            <Radio.Button value={notations.FretMarkerDisplay.Degree}>degree</Radio.Button>
            <Radio.Button value={notations.FretMarkerDisplay.Note}>note</Radio.Button>
          </Radio.Group>

          <br />
          <br />

          <h5>scale</h5>
          <Select defaultValue="none" style={{ width: '100%' }} onChange={onSelectedScaleChange}>
            <Select.OptGroup label="default">
              <Select.Option value="none">none</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="recommended">
              <Select.Option value="dynamic">
                <Tooltip title="based on the current key signature">dynamic</Tooltip>
              </Select.Option>
              {scales.main.map((scale) => (
                <Select.Option key={`main-${scale}`} value={scale}>
                  {scale}
                </Select.Option>
              ))}
            </Select.OptGroup>
            {scales.pentatonic.length > 0 && (
              <Select.OptGroup label="pentatonic">
                {scales.pentatonic.map((scale) => (
                  <Select.Option key={`pentatonic-${scale}`} value={scale}>
                    {scale}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            )}
            {scales.major.length > 0 && (
              <Select.OptGroup label="major">
                {scales.major.map((scale) => (
                  <Select.Option key={`major-${scale}`} value={scale}>
                    {scale}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            )}
            {scales.minor.length > 0 && (
              <Select.OptGroup label="minor">
                {scales.minor.map((scale) => (
                  <Select.Option key={`minor-${scale}`} value={scale}>
                    {scale}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            )}
          </Select>

          <br />
          <br />

          <h5>display</h5>
          <Checkbox.Group
            options={displayModeOptions}
            onChange={onDisplayModeChange}
            value={displayModeCheckboxValues}
          />

          <Divider />

          <Checkbox checked={settings.isAutoscrollPreferred} onChange={onAutoscrollPreferenceChange}>
            autoscroll
          </Checkbox>

          <br />
          <br />

          <Tooltip
            title={
              device.inputType === 'touchOnly'
                ? 'you can also longpress the notation'
                : 'you can also click and drag on the notation'
            }
          >
            <Checkbox checked={settings.isLoopActive} onChange={onIsLoopActiveChange}>
              loop <InfoCircleOutlined />
            </Checkbox>
          </Tooltip>

          <Divider />

          <h5>playback</h5>
          <Playback mediaPlayer={mediaPlayer} />

          <br />
        </SettingsInner>
      </Drawer>
    </Outer>
  );
};

import { InfoCircleOutlined, PauseOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Divider, Drawer, Radio, RadioChangeEvent, Row, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxOptionType, CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useDevice } from '../ctx/device';
import { KeyboardKey, useKeyDownEffect } from '../hooks/useKeyDownEffect';
import { NotationSettings, Quality } from '../hooks/useNotationSettings';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { useScales } from '../hooks/useScales';
import { MediaPlayer, PlayState, QualitySelectionStrategy } from '../lib/MediaPlayer';
import { MusicDisplay } from '../lib/MusicDisplay';
import { DisplayMode } from '../lib/musicxml';
import * as notations from '../lib/notations';
import { Nullable } from '../util/types';
import { Detail } from './Detail';
import { Playback } from './Playback';
import { Seekbar } from './Seekbar';
import { Select, SelectOption } from './Select';

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
  padding: 4px;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const getQualityValue = (quality: Quality): string => {
  switch (quality.type) {
    case 'strategy':
      return quality.strategy;
    case 'specified':
      return quality.level.id;
  }
};

const getQualityLabel = (quality: Quality): string => {
  switch (quality.type) {
    case 'strategy':
      return quality.strategy;
    case 'specified':
      return quality.level.label;
  }
};

const isQualitySelectionStrategy = (value: any): value is QualitySelectionStrategy => {
  return Object.values(QualitySelectionStrategy).includes(value);
};

type Props = {
  videoControls: boolean;
  notation: Nullable<notations.RenderableNotation>;
  musicDisplay: MusicDisplay;
  mediaPlayer: MediaPlayer;
  settings: NotationSettings;
  setSettings(settings: NotationSettings): void;
  settingsContainer?: HTMLElement | false;
};

export const NotationPlayerControls: React.FC<Props> = (props) => {
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
  const selectScaleOptions = useMemo<SelectOption[]>(() => {
    return ['none', 'dynamic', ...scales.main, ...scales.pentatonic, ...scales.major, ...scales.minor].map((label) => ({
      label,
      value: label,
    }));
  }, [scales]);

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

  // quality
  const [qualityChoices, setQualityChoices] = useState<Quality[]>(() => [
    { type: 'strategy', strategy: QualitySelectionStrategy.Auto },
  ]);
  useEffect(() => {
    const syncQualityChoices = () => {
      const qualityLevels = mediaPlayer.getQualityLevels();
      setQualityChoices([
        { type: 'strategy', strategy: QualitySelectionStrategy.Auto },
        ...qualityLevels.map((level) => ({ type: 'specified' as const, level })),
      ]);
    };
    const id = mediaPlayer.eventBus.subscribe('qualitylevelschange', syncQualityChoices);
    return () => {
      mediaPlayer.eventBus.unsubscribe(id);
    };
  }, [mediaPlayer]);
  const onQualityChoiceChange = (qualityId: string) => {
    if (isQualitySelectionStrategy(qualityId)) {
      setSettings({ ...settings, quality: { type: 'strategy', strategy: qualityId } });
      return;
    }

    const quality = qualityChoices.find(
      (qualityChoice) => qualityChoice.type === 'specified' && qualityChoice.level.id === qualityId
    );
    if (quality) {
      setSettings({ ...settings, quality });
    }
  };
  const qualitySelectOptions = useMemo<SelectOption[]>(
    () =>
      qualityChoices.map((quality) => {
        const value = getQualityValue(quality);
        const label = getQualityLabel(quality);
        return { label, value };
      }),
    [qualityChoices]
  );

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

  // keyboard
  const togglePlay = useCallback(() => {
    const playState = mediaPlayer.getPlayState();
    switch (playState) {
      case PlayState.Paused:
        mediaPlayer.play();
        break;
      case PlayState.Playing:
        mediaPlayer.pause();
        break;
    }
  }, [mediaPlayer]);
  useKeyDownEffect([KeyboardKey.Space], togglePlay);

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
          <Select
            defaultValue="none"
            style={{ width: '100%' }}
            onChange={onSelectedScaleChange}
            options={selectScaleOptions}
          />

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

          {qualityChoices.length > 1 && (
            <>
              <br />

              <h5>quality</h5>
              <Select
                value={getQualityValue(settings.quality)}
                onChange={onQualityChoiceChange}
                style={{ width: '100%' }}
                options={qualitySelectOptions}
              />
            </>
          )}

          <br />
        </SettingsInner>
      </Drawer>
    </Outer>
  );
};

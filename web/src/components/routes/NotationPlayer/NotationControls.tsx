import { PauseOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Col, Drawer, Row, Slider } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { VideoJsPlayer } from 'video.js';
import { CursorInfo, MusicDisplay } from '../../../lib/MusicDisplay';
import { isTemporal } from '../../../lib/MusicDisplay/pointer/pointerTypeAssert';
import { ScrollBehaviorType } from '../../../lib/MusicDisplay/Scroller';
import { NotationDetail } from './NotationDetail';
import { NotationPlayerSettings } from './types';
import { useTipFormatter } from './useTipFormatter';
import { useVideoPlayerControls, VideoPlayerState } from './useVideoPlayerControls';

const Outer = styled.div`
  z-index: 3;
  background: white;
  border-top: 1px solid ${(props) => props.theme['@border-color']};
  padding: 16px 16px;
  width: 100%;
`;

const SliderOuter = styled.div`
  width: 100%;
  padding: 0 16px 0 16px;
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
  bottom: 80px;
  right: 24px;
`;

export type Props = {
  durationMs: number;
  songName: string;
  artistName: string;
  thumbnailUrl: string;
  videoPlayer: VideoJsPlayer;
  musicDisplay: MusicDisplay | null;
  settings: NotationPlayerSettings;
  lastUserScrollAt: Date | null;
  onSettingsChange: (notationPlayerSettings: NotationPlayerSettings) => void;
  onDivMount: (div: HTMLDivElement) => void;
};

export const NotationControls: React.FC<Props> = (props) => {
  const { videoPlayer, settings, musicDisplay, durationMs, onSettingsChange, onDivMount } = props;

  const controlsDivRef = useRef<HTMLDivElement>(null);
  const isMusicDisplayResizingRef = useRef(false);
  const isMusicDisplayLoadingRef = useRef(false);

  const [isNoopScrolling, setIsNoopScrolling] = useState(() => {
    return musicDisplay?.scroller.type === ScrollBehaviorType.Noop;
  });
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [cursorInfo, setCursorInfo] = useState<CursorInfo>({
    currentMeasureIndex: 0,
    currentMeasureNumber: 1,
    numMeasures: 0,
  });

  const { videoPlayerState, currentTimeMs, play, pause, suspend, unsuspend, seek } = useVideoPlayerControls(
    videoPlayer
  );
  const tipFormatter = useTipFormatter(cursorInfo, durationMs);
  const value = props.durationMs === 0 ? 0 : (currentTimeMs / props.durationMs) * 100;
  const handleStyle = useMemo(() => ({ width: 21, height: 21, marginTop: -8 }), []);
  const isPaused = videoPlayerState === VideoPlayerState.Paused;
  const isPlaying = videoPlayerState === VideoPlayerState.Playing;

  const onSettingsClick = useCallback(() => {
    setIsSettingsVisible((isSettingsVisible) => !isSettingsVisible);
  }, []);

  const onSettingsClose = useCallback(() => {
    setIsSettingsVisible(false);
  }, []);

  const onFretboardVisibilityChange = useCallback(
    (event: CheckboxChangeEvent) => {
      onSettingsChange({ ...settings, isFretboardVisible: event.target.checked });
    },
    [settings, onSettingsChange]
  );

  const onAutoscrollPreferenceChange = useCallback(
    (event: CheckboxChangeEvent) => {
      onSettingsChange({ ...settings, isAutoscrollPreferred: event.target.checked });
    },
    [settings, onSettingsChange]
  );

  const onChange = useCallback(
    (value: number) => {
      suspend();
      const timeMs = (value / 100) * durationMs;
      if (musicDisplay && !musicDisplay.loop.timeMsRange.contains(timeMs)) {
        musicDisplay.loop.deactivate();
      }
      seek(timeMs);
    },
    [durationMs, musicDisplay, suspend, seek]
  );

  const onAfterChange = useCallback(() => {
    unsuspend();
  }, [unsuspend]);

  const onAutoscrollDisabledClose = useCallback(() => {
    if (!musicDisplay) {
      return;
    }
    musicDisplay.scroller.startAutoScrolling();
    musicDisplay.cursor.scrollIntoView();
  }, [musicDisplay]);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    if (!settings.isAutoscrollPreferred) {
      return;
    }
    musicDisplay.scroller.startAutoScrolling();
  }, [musicDisplay, settings.isAutoscrollPreferred]);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    if (!musicDisplay.loop.isActive) {
      return;
    }
    const { timeMsRange } = musicDisplay.loop;
    if (timeMsRange.contains(currentTimeMs)) {
      return;
    }
    seek(timeMsRange.start);
  }, [currentTimeMs, musicDisplay, seek]);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    if (!isPlaying) {
      return;
    }
    const eventBusIds = [
      musicDisplay.eventBus.subscribe('externalscrolldetected', () => {
        if (isMusicDisplayResizingRef.current) {
          return;
        }
        if (isMusicDisplayLoadingRef.current) {
          return;
        }
        musicDisplay.scroller.disable();
      }),
      musicDisplay.eventBus.subscribe('resizestarted', () => {
        isMusicDisplayResizingRef.current = true;
      }),
      musicDisplay.eventBus.subscribe('resizeended', () => {
        isMusicDisplayResizingRef.current = false;
      }),
      musicDisplay.eventBus.subscribe('loadstarted', () => {
        isMusicDisplayLoadingRef.current = true;
      }),
      musicDisplay.eventBus.subscribe('loadended', () => {
        isMusicDisplayLoadingRef.current = false;
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [isPlaying, musicDisplay]);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('scrollbehaviorchanged', (payload) => {
        setIsNoopScrolling(payload.type === ScrollBehaviorType.Noop);
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay]);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('cursorinfochanged', setCursorInfo),
      musicDisplay.eventBus.subscribe('cursorsnapshotclicked', (payload) => {
        if (!musicDisplay.loop.timeMsRange.contains(payload.src.timeMs)) {
          musicDisplay.loop.deactivate();
        }
        seek(payload.src.timeMs);
        musicDisplay.scroller.startAutoScrolling();
        musicDisplay.cursor.scrollIntoView();
      }),
      musicDisplay.eventBus.subscribe('cursordragstarted', (payload) => {
        musicDisplay.scroller.startManualScrolling();

        if (payload.src.cursor === musicDisplay.loop.startCursor) {
          musicDisplay.loop.anchor(musicDisplay.loop.timeMsRange.end);
        }
        if (payload.src.cursor === musicDisplay.loop.endCursor) {
          musicDisplay.loop.anchor(musicDisplay.loop.timeMsRange.start);
        }

        suspend();
      }),
      musicDisplay.eventBus.subscribe('cursordragupdated', (payload) => {
        musicDisplay.scroller.updateScrollIntent(payload.dst.position.relY);
        if (!isTemporal(payload.dst)) {
          return;
        }

        const { cursor } = payload.src;
        const { timeMs } = payload.dst;

        if (cursor === musicDisplay.cursor) {
          if (!musicDisplay.loop.timeMsRange.contains(timeMs)) {
            musicDisplay.loop.deactivate();
          }
          cursor.update(timeMs);
          seek(timeMs);
        }
        if (cursor === musicDisplay.loop.startCursor) {
          musicDisplay.loop.update(timeMs);
        }
        if (cursor === musicDisplay.loop.endCursor) {
          musicDisplay.loop.update(timeMs);
        }
      }),
      musicDisplay.eventBus.subscribe('cursordragended', (payload) => {
        musicDisplay.scroller.startAutoScrolling();
        musicDisplay.cursor.scrollIntoView();
        unsuspend();
      }),
      musicDisplay.eventBus.subscribe('selectionstarted', (payload) => {
        musicDisplay.scroller.startManualScrolling();
        musicDisplay.loop.anchor(payload.selection.anchorTimeMs);
        musicDisplay.loop.activate();
        suspend();
      }),
      musicDisplay.eventBus.subscribe('selectionupdated', (payload) => {
        musicDisplay.scroller.updateScrollIntent(payload.dst.position.relY);
        musicDisplay.loop.update(payload.selection.seekerTimeMs);
        seek(payload.selection.seekerTimeMs);
      }),
      musicDisplay.eventBus.subscribe('selectionended', () => {
        musicDisplay.scroller.startAutoScrolling();
        seek(musicDisplay.loop.timeMsRange.start);
        musicDisplay.cursor.scrollIntoView();
        unsuspend();
      }),
      musicDisplay.eventBus.subscribe('measurelinechanged', () => {
        musicDisplay.cursor.scrollIntoView();
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, seek, suspend, unsuspend]);

  useEffect(() => {
    if (!controlsDivRef.current) {
      return;
    }
    onDivMount(controlsDivRef.current);
  }, [onDivMount]);

  return (
    <Outer ref={controlsDivRef}>
      {isNoopScrolling && settings.isAutoscrollPreferred && (
        <FloatingAlert
          showIcon
          closable
          closeText="enable"
          onClose={onAutoscrollDisabledClose}
          type="warning"
          message="autoscroll disabled"
        />
      )}
      <Row justify="center" align="middle">
        <Col xs={2} sm={2} md={2} lg={1} xl={1} xxl={1}>
          <Row justify="center" align="middle">
            {isPaused ? (
              <StyledButton size="large" shape="circle" icon={<RightOutlined />} onClick={play} />
            ) : (
              <StyledButton size="large" shape="circle" icon={<PauseOutlined />} onClick={pause} />
            )}
          </Row>
        </Col>
        <Col xs={20} sm={20} md={20} lg={20} xl={20} xxl={20}>
          <Row justify="center" align="middle">
            <SliderOuter>
              <Slider
                step={0.01}
                handleStyle={handleStyle}
                value={value}
                tipFormatter={tipFormatter}
                onChange={onChange}
                onAfterChange={onAfterChange}
              />
            </SliderOuter>
          </Row>
        </Col>
        <Col xs={2} sm={2} md={2} lg={1} xl={1} xxl={1}>
          <Row justify="center" align="middle">
            <StyledButton size="large" shape="circle" icon={<SettingOutlined />} onClick={onSettingsClick} />
          </Row>
        </Col>
        <Col xs={0} sm={0} md={0} lg={0} xl={2} xxl={2}>
          <Row justify="center" align="middle">
            <NotationDetail thumbnailUrl={props.thumbnailUrl} artistName={props.artistName} songName={props.songName} />
          </Row>
        </Col>
      </Row>
      <Drawer
        title="settings"
        placement="right"
        keyboard
        closable={false}
        visible={isSettingsVisible}
        onClose={onSettingsClose}
        zIndex={2}
      >
        <SettingsInner>
          <Checkbox checked={props.settings.isFretboardVisible} onChange={onFretboardVisibilityChange}>
            fretboard
          </Checkbox>
          <Checkbox checked={props.settings.isAutoscrollPreferred} onChange={onAutoscrollPreferenceChange}>
            autoscroll
          </Checkbox>
        </SettingsInner>
      </Drawer>
    </Outer>
  );
};

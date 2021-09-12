import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { MusicDisplay, SelectionEdge, SupportedSVGEventNames } from '../../lib/MusicDisplay';
import { PointerTargetType } from '../../lib/MusicDisplay/pointer';
import { isNonePointerTarget, isPositional } from '../../lib/MusicDisplay/pointer/pointerTypeAssert';
import { RootState } from '../../store';
import { Duration } from '../../util/Duration';

const SELECTION_INDETERMINATE_ZONE_DURATION = Duration.ms(500);

const Outer = styled.div<{ cursor: Cursor }>`
  margin-top: 24px;
  position: relative;
  cursor: ${(props) => props.cursor};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  opacity: 0.9;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 2;
  text-align: center;
  pointer-events: none;
`;

const Loading = styled.small`
  margin-top: 36px;
`;

const COMMON_SVG_EVENT_NAMES: SupportedSVGEventNames[] = [];
const MOUSE_SVG_EVENT_NAMES: SupportedSVGEventNames[] = ['mousedown', 'mousemove', 'mouseup'];
const TOUCH_SVG_EVENT_NAMES: SupportedSVGEventNames[] = ['touchstart', 'touchmove', 'touchend'];

type NotationProps = {
  musicXmlUrl: string;
  deadTimeMs: number;
  durationMs: number;
  scrollContainerRef: RefObject<HTMLDivElement>;
  onUserScroll?: () => void;
  onMusicDisplayChange?: (musicDisplay: MusicDisplay | null) => void;
};

enum Cursor {
  Default = 'default',
  Pointer = 'pointer',
  EWResize = 'ew-resize',
  EResize = 'e-resize',
  WResize = 'w-resize',
  Grab = 'grab',
  Grabbing = 'grabbing',
}

export const Notation: React.FC<NotationProps> = (props) => {
  const deviceInputType = useSelector<RootState, 'mouseOnly' | 'touchOnly' | 'hybrid'>(
    (state) => state.device.inputType
  );

  const { musicXmlUrl, deadTimeMs, durationMs, scrollContainerRef, onMusicDisplayChange } = props;

  const divRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState(Cursor.Pointer);

  const [isLoading, setIsLoading] = useState(false);
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay | null>(null);

  useEffect(() => {
    if (onMusicDisplayChange) {
      onMusicDisplayChange(musicDisplay);
    }
  }, [musicDisplay, onMusicDisplayChange]);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('selectionupdated', (payload) => {
        const { anchorTimeMs, seekerTimeMs } = payload.selection;
        if (Math.abs(anchorTimeMs - seekerTimeMs) <= SELECTION_INDETERMINATE_ZONE_DURATION.ms) {
          setCursor(Cursor.EWResize);
        } else if (anchorTimeMs > seekerTimeMs) {
          setCursor(Cursor.EResize);
        } else {
          setCursor(Cursor.WResize);
        }
      }),
      musicDisplay.eventBus.subscribe('cursorentered', (payload) => {
        setCursor(Cursor.Grab);
      }),
      musicDisplay.eventBus.subscribe('cursorexited', () => {
        setCursor(Cursor.Pointer);
      }),
      musicDisplay.eventBus.subscribe('selectionentered', (payload) => {
        setCursor(payload.src.edge === SelectionEdge.Start ? Cursor.EResize : Cursor.WResize);
      }),
      musicDisplay.eventBus.subscribe('cursordragstarted', () => {
        setCursor(Cursor.Grabbing);
      }),
      musicDisplay.eventBus.subscribe('cursordragended', (payload) => {
        setCursor(payload.dst.type === PointerTargetType.Cursor ? Cursor.Grab : Cursor.Pointer);
      }),
      musicDisplay.eventBus.subscribe('notargetentered', () => {
        setCursor(Cursor.Default);
      }),
      musicDisplay.eventBus.subscribe('cursorsnapshotentered', () => {
        setCursor(Cursor.Pointer);
      }),
      musicDisplay.eventBus.subscribe('cursorsnapshotclicked', () => {
        setCursor(Cursor.Grab);
      }),
      musicDisplay.eventBus.subscribe('pointerdown', (payload) => {
        if (isNonePointerTarget(payload.src)) {
          return;
        }
        if (!isPositional(payload.src)) {
          return;
        }
        const { x, y } = payload.src.position;
        musicDisplay.renderRipple(x, y);
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
      setCursor(Cursor.Pointer);
    };
  }, [musicDisplay]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    const div = divRef.current;
    if (!div) {
      return;
    }

    const svgSettings = {
      eventNames: [...COMMON_SVG_EVENT_NAMES],
      isIdlePingerEnabled: false,
    };
    switch (deviceInputType) {
      case 'mouseOnly':
        svgSettings.eventNames = [...svgSettings.eventNames, ...MOUSE_SVG_EVENT_NAMES];
        svgSettings.isIdlePingerEnabled = true;
        break;
      case 'touchOnly':
        svgSettings.eventNames = [...svgSettings.eventNames, ...TOUCH_SVG_EVENT_NAMES];
        svgSettings.isIdlePingerEnabled = false;
        break;
      case 'hybrid':
        svgSettings.eventNames = [...svgSettings.eventNames, ...MOUSE_SVG_EVENT_NAMES, ...TOUCH_SVG_EVENT_NAMES];
        svgSettings.isIdlePingerEnabled = true;
        break;
    }

    const musicDisplay = new MusicDisplay(div, {
      syncSettings: { deadTimeMs, durationMs },
      svgSettings,
      scrollContainer,
    });

    const startLoading = () => setIsLoading(true);
    const stopLoading = () => setIsLoading(false);

    const loadStartedId = musicDisplay.eventBus.subscribe('loadstarted', startLoading);
    const loadEndedId = musicDisplay.eventBus.subscribe('loadended', stopLoading);
    const resizeStartedId = musicDisplay.eventBus.subscribe('resizestarted', startLoading);
    const resizeEndedId = musicDisplay.eventBus.subscribe('resizeended', stopLoading);

    setMusicDisplay(musicDisplay);
    musicDisplay.load(musicXmlUrl);

    return () => {
      musicDisplay.eventBus.unsubscribe(resizeEndedId);
      musicDisplay.eventBus.unsubscribe(resizeStartedId);
      musicDisplay.eventBus.unsubscribe(loadEndedId);
      musicDisplay.eventBus.unsubscribe(loadStartedId);

      musicDisplay.dispose();

      setMusicDisplay(null);
    };
  }, [musicXmlUrl, deadTimeMs, durationMs, scrollContainerRef, deviceInputType]);

  return (
    <Outer data-notation cursor={cursor}>
      {isLoading && (
        <LoadingOverlay>
          <Loading>loading</Loading>
        </LoadingOverlay>
      )}
      <div draggable={false} ref={divRef} style={{ userSelect: 'none' }} />
    </Outer>
  );
};

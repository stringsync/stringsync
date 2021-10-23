import React, { RefObject, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useDevice } from '../../ctx/device';
import { OpenSheetMusicDisplay } from '../../lib/MusicDisplay';
import { CursorStyleType } from '../../lib/MusicDisplay/cursors';
import { isNonePointerTarget, isPositional, PointerTargetType } from '../../lib/MusicDisplay/pointer';
import { SupportedSVGEventNames } from '../../lib/MusicDisplay/svg';

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
  onMusicDisplayChange?: (musicDisplay: OpenSheetMusicDisplay | null) => void;
};

enum Cursor {
  Default = 'default',
  Crosshair = 'crosshair',
  ColResize = 'col-resize',
  EWResize = 'ew-resize',
  EResize = 'e-resize',
  WResize = 'w-resize',
  Grab = 'grab',
  Grabbing = 'grabbing',
}

export const Notation: React.FC<NotationProps> = (props) => {
  const device = useDevice();

  const { musicXmlUrl, deadTimeMs, durationMs, scrollContainerRef, onMusicDisplayChange } = props;

  const divRef = useRef<HTMLDivElement>(null);

  const [cursor, setCursor] = useState(Cursor.Crosshair);
  const [isLoading, setIsLoading] = useState(false);
  const [musicDisplay, setMusicDisplay] = useState<OpenSheetMusicDisplay | null>(null);

  useEffect(() => {
    if (onMusicDisplayChange) {
      onMusicDisplayChange(musicDisplay);
    }
  }, [musicDisplay, onMusicDisplayChange]);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    const isDeviceTouchable = device.inputType === 'touchOnly' || device.inputType === 'hybrid';

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('cursorentered', (payload) => {
        setCursor(Cursor.Grab);
        payload.src.cursor.updateStyle(CursorStyleType.Interacting);
      }),
      musicDisplay.eventBus.subscribe('cursorexited', (payload) => {
        setCursor(Cursor.Crosshair);
        payload.src.cursor.updateStyle(CursorStyleType.Default);
      }),
      musicDisplay.eventBus.subscribe('selectionstarted', (payload) => {
        setCursor(Cursor.ColResize);
      }),
      musicDisplay.eventBus.subscribe('selectionupdated', (payload) => {
        setCursor(Cursor.ColResize);
      }),
      musicDisplay.eventBus.subscribe('selectionended', () => {
        musicDisplay.getLoop().resetStyles();
      }),
      musicDisplay.eventBus.subscribe('selectionentered', (payload) => {
        setCursor(Cursor.ColResize);
        payload.src.cursor.updateStyle(CursorStyleType.Interacting);
      }),
      musicDisplay.eventBus.subscribe('selectionexited', (payload) => {
        payload.src.cursor.updateStyle(CursorStyleType.Default);
      }),
      musicDisplay.eventBus.subscribe('cursordragstarted', (payload) => {
        setCursor(Cursor.Grabbing);
        if (isDeviceTouchable) {
          payload.src.cursor.updateStyle(CursorStyleType.Interacting);
        }
      }),
      musicDisplay.eventBus.subscribe('cursordragended', (payload) => {
        setCursor(payload.dst.type === PointerTargetType.Cursor ? Cursor.Grab : Cursor.Crosshair);
        if (isDeviceTouchable) {
          payload.src.cursor.updateStyle(CursorStyleType.Default);
        }
      }),
      musicDisplay.eventBus.subscribe('notargetentered', () => {
        setCursor(Cursor.Default);
      }),
      musicDisplay.eventBus.subscribe('cursorsnapshotentered', () => {
        setCursor(Cursor.Crosshair);
      }),
      musicDisplay.eventBus.subscribe('pointerdown', (payload) => {
        if (isNonePointerTarget(payload.src)) {
          return;
        }
        if (!isPositional(payload.src)) {
          return;
        }
        const { x, y } = payload.src.position;
        musicDisplay.getFx().ripple(x, y);
      }),
      musicDisplay.eventBus.subscribe('longpress', (payload) => {
        if (isNonePointerTarget(payload.src)) {
          return;
        }
        if (!isPositional(payload.src)) {
          return;
        }
        const { x, y } = payload.src.position;
        musicDisplay.getFx().bigRipple(x, y);
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
      setCursor(Cursor.Crosshair);
    };
  }, [device, musicDisplay]);

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
    };
    switch (device.inputType) {
      case 'mouseOnly':
        svgSettings.eventNames = [...svgSettings.eventNames, ...MOUSE_SVG_EVENT_NAMES];
        break;
      case 'touchOnly':
        svgSettings.eventNames = [...svgSettings.eventNames, ...TOUCH_SVG_EVENT_NAMES];
        break;
      case 'hybrid':
        svgSettings.eventNames = [...svgSettings.eventNames, ...MOUSE_SVG_EVENT_NAMES, ...TOUCH_SVG_EVENT_NAMES];
        break;
    }

    const musicDisplay = new OpenSheetMusicDisplay(div, {
      syncSettings: { deadTimeMs, durationMs },
      svgSettings,
      scrollContainer,
    });

    const startLoading = () => setIsLoading(true);
    const stopLoading = () => setIsLoading(false);

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('loadstarted', startLoading),
      musicDisplay.eventBus.subscribe('loadended', stopLoading),
      musicDisplay.eventBus.subscribe('resizestarted', startLoading),
      musicDisplay.eventBus.subscribe('resizeended', stopLoading),
    ];

    // On mobile, resize will fire when scrolling.
    let width = window.outerWidth;
    let height = window.outerHeight;
    const dispatchResizeStarted = () => {
      if (width !== window.outerWidth || height !== window.outerHeight) {
        width = window.outerWidth;
        height = window.outerHeight;
        musicDisplay.eventBus.dispatch('resizestarted', {});
      }
    };
    window.addEventListener('resize', dispatchResizeStarted);

    setMusicDisplay(musicDisplay);
    musicDisplay.load(musicXmlUrl);

    return () => {
      setMusicDisplay(null);

      window.removeEventListener('resize', dispatchResizeStarted);

      musicDisplay.eventBus.unsubscribe(...eventBusIds);

      musicDisplay.dispose();
    };
  }, [musicXmlUrl, deadTimeMs, durationMs, scrollContainerRef, device]);

  return (
    <Outer data-notation cursor={cursor}>
      {isLoading && (
        <LoadingOverlay>
          <Loading>loading</Loading>
        </LoadingOverlay>
      )}
      <div draggable={false} ref={divRef} />
    </Outer>
  );
};

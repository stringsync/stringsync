import { Skeleton } from 'antd';
import { noop } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { RenderableNotation } from '.';
import { Device, useDevice } from '../../ctx/device';
import { MusicDisplay as MusicDisplayBackend } from '../../lib/MusicDisplay';
import { CursorStyleType } from '../../lib/MusicDisplay/cursors';
import { isNonePointerTarget, isPositional, PointerTargetType } from '../../lib/MusicDisplay/pointer';
import { SupportedSVGEventNames } from '../../lib/MusicDisplay/svg';
import { Nullable } from '../../util/types';

const MOUSE_SVG_EVENT_NAMES: SupportedSVGEventNames[] = ['mousedown', 'mousemove', 'mouseup'];
const TOUCH_SVG_EVENT_NAMES: SupportedSVGEventNames[] = ['touchstart', 'touchmove', 'touchend'];

const getSvgEventNames = (device: Device): SupportedSVGEventNames[] => {
  switch (device.inputType) {
    case 'mouseOnly':
      return [...MOUSE_SVG_EVENT_NAMES];
    case 'touchOnly':
      return [...TOUCH_SVG_EVENT_NAMES];
    case 'hybrid':
      return [...MOUSE_SVG_EVENT_NAMES, ...TOUCH_SVG_EVENT_NAMES];
  }
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

const Outer = styled.div<{ cursor: Cursor }>`
  margin-top: 24px;
  position: relative;
  cursor: ${(props) => props.cursor};
`;

const SkeletonContainer = styled.div`
  padding: 64px;
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

type Props = {
  loading: boolean;
  notation: Nullable<RenderableNotation>;
  onMusicDisplayChange?: (musicDisplay: MusicDisplayBackend | null) => void;
};

export const MusicDisplay: React.FC<Props> = (props) => {
  // props
  const loading = props.loading;
  const notation = props.notation;

  // music display
  const [musicDisplay, setMusicDisplay] = useState<Nullable<MusicDisplayBackend>>(null);
  const device = useDevice();
  const musicDisplayDivRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState(Cursor.Crosshair);
  const [musicDisplayLoading, setMusicDisplayLoading] = useState(false);
  const onMusicDisplayChange = props.onMusicDisplayChange || noop;

  useEffect(() => {
    if (!notation) {
      return;
    }
    if (!notation.musicXmlUrl) {
      return;
    }

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    const musicDisplayDiv = musicDisplayDivRef.current;
    if (!musicDisplayDiv) {
      return;
    }

    const musicDisplay = new MusicDisplayBackend(musicDisplayDiv, {
      syncSettings: { deadTimeMs: notation.deadTimeMs, durationMs: notation.durationMs },
      svgSettings: { eventNames: getSvgEventNames(device) },
      scrollContainer,
    });

    const startLoading = () => setMusicDisplayLoading(true);
    const stopLoading = () => setMusicDisplayLoading(false);

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('loadstarted', startLoading),
      musicDisplay.eventBus.subscribe('loadended', stopLoading),
      musicDisplay.eventBus.subscribe('resizestarted', startLoading),
      musicDisplay.eventBus.subscribe('resizeended', stopLoading),
    ];

    // On mobile, resize will fire when scrolling. Prevent it by checking the window dimensions.
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dispatchResizeStarted = () => {
      if (width !== window.innerWidth || height !== window.innerHeight) {
        width = window.innerWidth;
        height = window.innerHeight;
        musicDisplay.eventBus.dispatch('resizestarted', {});
      }
    };
    window.addEventListener('resize', dispatchResizeStarted);

    setMusicDisplay(musicDisplay);
    musicDisplay.load(notation.musicXmlUrl);

    return () => {
      setMusicDisplay(null);
      onMusicDisplayChange(null);
      window.removeEventListener('resize', dispatchResizeStarted);
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
      musicDisplay.dispose();
    };
  }, [notation, device, onMusicDisplayChange]);

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

  return (
    <div data-testid="music-display">
      {loading && (
        <SkeletonContainer>
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
        </SkeletonContainer>
      )}

      {!loading && (
        <Outer data-notation cursor={cursor} ref={scrollContainerRef}>
          {musicDisplayLoading && (
            <LoadingOverlay>
              <Loading>loading</Loading>
            </LoadingOverlay>
          )}
          <div draggable={false} ref={musicDisplayDivRef} />
        </Outer>
      )}
    </div>
  );
};

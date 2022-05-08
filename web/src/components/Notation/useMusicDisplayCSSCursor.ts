import { useEffect, useState } from 'react';
import { useDevice } from '../../ctx/device';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { CursorStyleType } from '../../lib/MusicDisplay/cursors';
import { PointerTargetType } from '../../lib/MusicDisplay/pointer';

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

export const useCSSCursor = (musicDisplay: MusicDisplay) => {
  const [cursor, setCursor] = useState(Cursor.Default);
  const device = useDevice();

  useEffect(() => {
    if (device.inputType === 'touchOnly') {
      return;
    }

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
        payload.src.cursor.updateStyle(CursorStyleType.Interacting);
      }),
      musicDisplay.eventBus.subscribe('cursordragended', (payload) => {
        setCursor(payload.dst.type === PointerTargetType.Cursor ? Cursor.Grab : Cursor.Crosshair);
        payload.src.cursor.updateStyle(CursorStyleType.Default);
      }),
      musicDisplay.eventBus.subscribe('notargetentered', () => {
        setCursor(Cursor.Default);
      }),
      musicDisplay.eventBus.subscribe('cursorsnapshotentered', () => {
        setCursor(Cursor.Crosshair);
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
      setCursor(Cursor.Crosshair);
    };
  }, [device, musicDisplay]);

  return cursor;
};

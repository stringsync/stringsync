import { EventBus } from '../../EventBus';
import { NoopCursor } from '../cursors/NoopCursor';
import { CursorSnapshot } from '../locator';
import { MusicDisplayEventBus } from '../types';
import * as pointer from './pointer';
import { PointerService } from './pointer';
import {
  CursorPointerTarget,
  CursorSnapshotPointerTarget,
  NonePointerTarget,
  PointerPosition,
  PointerTargetType,
} from './types';

const POINTER_POSITION: PointerPosition = { x: 0, y: 0, relX: 0, relY: 0 };

const NONE_POINTER_TARGET: NonePointerTarget = { type: PointerTargetType.None, position: POINTER_POSITION };
const CURSOR_POINTER_TARGET: CursorPointerTarget = {
  type: PointerTargetType.Cursor,
  cursor: new NoopCursor(),
  timeMs: 0,
  position: POINTER_POSITION,
};
const CURSOR_SNAPSHOT_POINTER_TARGET: CursorSnapshotPointerTarget = {
  type: PointerTargetType.CursorSnapshot,
  cursorSnapshot: {} as CursorSnapshot,
  timeMs: 0,
  position: POINTER_POSITION,
};

describe('pointerMachine', () => {
  let eventBus: MusicDisplayEventBus;
  let pointerService: PointerService;

  beforeEach(() => {
    jest.useFakeTimers();
    eventBus = new EventBus();
    pointerService = pointer.createService(eventBus);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initial', () => {
    it('intializes in the up state', () => {
      expect(pointerService.state.matches('up')).toBeTrue();
    });

    it('initializes with the initial context', () => {
      expect(pointerService.state.context).toStrictEqual({ ...pointer.model.initialContext });
    });
  });

  describe('up', () => {
    it('updates hover context on move event', () => {
      const nextState = pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));
      expect(nextState.context.hoverTarget).toStrictEqual(CURSOR_POINTER_TARGET);
    });

    it('dispatches cursorentered events on move event when entering cursor target', () => {
      const onCursorEntered = jest.fn();
      eventBus.subscribe('cursorentered', onCursorEntered);

      pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));

      expect(onCursorEntered).toHaveBeenCalledTimes(1);
    });

    it('does not dispatch cursorentered events when moving inside same cursor target', () => {
      pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));

      const onCursorEntered = jest.fn();
      eventBus.subscribe('cursorentered', onCursorEntered);

      pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));
      pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));

      expect(onCursorEntered).not.toBeCalled();
    });

    it('dispatches cursorentered events on move event when entering different cursor', () => {
      const cursorTarget1 = CURSOR_POINTER_TARGET;
      const cursorTarget2: CursorPointerTarget = {
        type: PointerTargetType.Cursor,
        cursor: new NoopCursor(),
        timeMs: 1,
        position: POINTER_POSITION,
      };

      pointerService.send(pointer.events.move(cursorTarget1));

      const onCursorEntered = jest.fn();
      eventBus.subscribe('cursorentered', onCursorEntered);

      pointerService.send(pointer.events.move(cursorTarget2));

      expect(onCursorEntered).toHaveBeenCalledTimes(1);
      expect(onCursorEntered).toHaveBeenCalledWith({ src: cursorTarget2 });
    });

    it('dispatches cursorexited events on move event when exiting cursor target', () => {
      const onCursorExited = jest.fn();
      eventBus.subscribe('cursorexited', onCursorExited);

      pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));
      pointerService.send(pointer.events.move(NONE_POINTER_TARGET));

      expect(onCursorExited).toHaveBeenCalledTimes(1);
    });

    it('does not dispatch cursorexited events on move event when inside same cursor target', () => {
      pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));

      const onCursorExited = jest.fn();
      eventBus.subscribe('cursorexited', onCursorExited);

      pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));
      pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));

      expect(onCursorExited).not.toBeCalled();
    });

    it('dispatches cursorexited events on move event when entering different cursor', () => {
      const cursorTarget1 = CURSOR_POINTER_TARGET;
      const cursorTarget2: CursorPointerTarget = {
        type: PointerTargetType.Cursor,
        cursor: new NoopCursor(),
        timeMs: 1,
        position: POINTER_POSITION,
      };

      pointerService.send(pointer.events.move(cursorTarget1));

      const onCursorExited = jest.fn();
      eventBus.subscribe('cursorexited', onCursorExited);

      pointerService.send(pointer.events.move(cursorTarget2));

      expect(onCursorExited).toHaveBeenCalledTimes(1);
      expect(onCursorExited).toHaveBeenCalledWith({ src: cursorTarget1 });
    });

    it('updates down state on down event', () => {
      const nextState = pointerService.send(pointer.events.down(CURSOR_POINTER_TARGET));
      expect(nextState.context.downTarget).toStrictEqual(CURSOR_POINTER_TARGET);
    });

    it('transitions to down.tap state on down', () => {
      const nextState = pointerService.send(pointer.events.down(NONE_POINTER_TARGET));
      expect(nextState.matches('down.tap')).toBeTrue();
    });

    it('ignores up events', () => {
      const state = pointerService.state;
      const nextState = pointerService.send(pointer.events.up(NONE_POINTER_TARGET));

      expect(nextState.value).toStrictEqual(state.value);
      expect(nextState.context).toStrictEqual(state.context);
    });

    it('tracks down target history', () => {
      const downTarget = pointerService.state.context.downTarget;
      const nextState = pointerService.send(pointer.events.down(CURSOR_POINTER_TARGET));
      const prevDownTarget = nextState.context.prevDownTarget;
      expect(prevDownTarget).toStrictEqual(downTarget);
    });

    it('tracks hover target history', () => {
      const hoverTarget = pointerService.state.context.hoverTarget;
      const nextState = pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));
      const prevHoverTarget = nextState.context.prevHoverTarget;
      expect(prevHoverTarget).toStrictEqual(hoverTarget);
    });
  });

  describe('down', () => {
    it('transitions to up state on up event', () => {
      pointerService.send(pointer.events.down(NONE_POINTER_TARGET));
      expect(pointerService.state.matches('down')).toBeTrue();

      pointerService.send(pointer.events.up(NONE_POINTER_TARGET));
      expect(pointerService.state.matches('up')).toBeTrue();
    });

    describe('press', () => {
      it('transitions to longpress after LONG_PRESS_DURATION', () => {
        pointerService.send(pointer.events.down(NONE_POINTER_TARGET));
        jest.advanceTimersByTime(pointer.LONG_PRESS_DURATION.ms);
        expect(pointerService.state.matches('down.longpress')).toBeTrue();
      });

      it('does not transition to longpress before LONG_PRESS_DURATION', () => {
        pointerService.send(pointer.events.down(NONE_POINTER_TARGET));
        jest.advanceTimersByTime(pointer.LONG_PRESS_DURATION.ms - 1);
        expect(pointerService.state.matches('down.press')).toBeTrue();
      });

      it('transitions to select state on move event when null target', () => {
        pointerService.send(pointer.events.down(NONE_POINTER_TARGET));
        jest.advanceTimersByTime(pointer.TAP_GRACE_DURATION.ms);
        pointerService.send(pointer.events.move(NONE_POINTER_TARGET));
        expect(pointerService.state.matches('down.select')).toBeTrue();
      });

      it('transitions to drag state on move event when cursor target', () => {
        pointerService.send(pointer.events.down(CURSOR_POINTER_TARGET));
        pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));
        expect(pointerService.state.matches('down.drag')).toBeTrue();
      });
    });

    describe('longpress', () => {
      it('dispatches longpress event on entry', () => {
        const onLongPress = jest.fn();
        eventBus.subscribe('longpress', onLongPress);

        pointerService.send(pointer.events.down(NONE_POINTER_TARGET));
        jest.advanceTimersByTime(pointer.LONG_PRESS_DURATION.ms);

        expect(onLongPress).toHaveBeenCalledTimes(1);
      });
    });

    describe('drag', () => {
      it('transitions to drag state on down event with a draggable', () => {
        pointerService.send(pointer.events.down(CURSOR_POINTER_TARGET));
        expect(pointerService.state.matches('down.drag')).toBeTrue();
      });

      it('dispatches cursordragstarted on entry', () => {
        const onCursorDragStarted = jest.fn();
        eventBus.subscribe('cursordragstarted', onCursorDragStarted);

        pointerService.send(pointer.events.down(CURSOR_POINTER_TARGET));

        expect(onCursorDragStarted).toHaveBeenCalledTimes(1);
      });

      it('dispatches cursordragupdated on move event', () => {
        const onCursorDragUpdated = jest.fn();
        eventBus.subscribe('cursordragupdated', onCursorDragUpdated);

        pointerService.send(pointer.events.down(CURSOR_POINTER_TARGET));
        pointerService.send(pointer.events.move(CURSOR_SNAPSHOT_POINTER_TARGET));

        expect(onCursorDragUpdated).toHaveBeenCalledTimes(1);
      });

      it('dispatches cursordragended on exit', () => {
        const onCursorDragEnded = jest.fn();
        eventBus.subscribe('cursordragended', onCursorDragEnded);

        pointerService.send(pointer.events.down(CURSOR_POINTER_TARGET));
        pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));
        pointerService.send(pointer.events.up(NONE_POINTER_TARGET));

        expect(onCursorDragEnded).toHaveBeenCalledTimes(1);
      });

      it('does not dispatch selectionstarted on entry', () => {
        const onSelectionStarted = jest.fn();
        eventBus.subscribe('selectionstarted', onSelectionStarted);

        pointerService.send(pointer.events.down(CURSOR_POINTER_TARGET));
        pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));

        expect(onSelectionStarted).not.toHaveBeenCalled();
      });

      it('does not dispatch selectionupdated on move event', () => {
        const onSelectionUpdated = jest.fn();
        eventBus.subscribe('selectionupdated', onSelectionUpdated);

        pointerService.send(pointer.events.down(CURSOR_POINTER_TARGET));
        pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));
        pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));

        expect(onSelectionUpdated).not.toHaveBeenCalled();
      });

      it('does not dispatch selectionexited on exit', () => {
        const onSelectionUpdated = jest.fn();
        eventBus.subscribe('selectionupdated', onSelectionUpdated);

        pointerService.send(pointer.events.down(CURSOR_POINTER_TARGET));
        pointerService.send(pointer.events.move(CURSOR_POINTER_TARGET));
        pointerService.send(pointer.events.up(NONE_POINTER_TARGET));

        expect(onSelectionUpdated).not.toHaveBeenCalled();
      });
    });

    describe('select', () => {
      it('dispatches selectionstarted on entry', () => {
        const onSelectionStarted = jest.fn();
        eventBus.subscribe('selectionstarted', onSelectionStarted);

        pointerService.send(pointer.events.down(NONE_POINTER_TARGET));
        jest.advanceTimersByTime(pointer.TAP_GRACE_DURATION.ms);
        pointerService.send(pointer.events.move(CURSOR_SNAPSHOT_POINTER_TARGET));

        expect(onSelectionStarted).toHaveBeenCalledTimes(1);
      });

      it('dispatches selectionupdated on move event', () => {
        const onSelectionUpdated = jest.fn();
        eventBus.subscribe('selectionupdated', onSelectionUpdated);

        pointerService.send(pointer.events.down(NONE_POINTER_TARGET));
        jest.advanceTimersByTime(pointer.TAP_GRACE_DURATION.ms);
        pointerService.send(pointer.events.move(CURSOR_SNAPSHOT_POINTER_TARGET));
        pointerService.send(pointer.events.move(CURSOR_SNAPSHOT_POINTER_TARGET));

        expect(onSelectionUpdated).toHaveBeenCalledTimes(1);
      });

      it('dispatches selectionended on exit', () => {
        const onSelectionEnded = jest.fn();
        eventBus.subscribe('selectionended', onSelectionEnded);

        pointerService.send(pointer.events.down(NONE_POINTER_TARGET));
        jest.advanceTimersByTime(pointer.TAP_GRACE_DURATION.ms);
        pointerService.send(pointer.events.move(CURSOR_SNAPSHOT_POINTER_TARGET));
        pointerService.send(pointer.events.up(NONE_POINTER_TARGET));

        expect(onSelectionEnded).toHaveBeenCalledTimes(1);
      });

      it('does not dispatch cursordragstarted on entry', () => {
        const onCursorDragStarted = jest.fn();
        eventBus.subscribe('cursordragstarted', onCursorDragStarted);

        pointerService.send(pointer.events.down(NONE_POINTER_TARGET));
        pointerService.send(pointer.events.move(NONE_POINTER_TARGET));

        expect(onCursorDragStarted).not.toHaveBeenCalled();
      });

      it('does not dispatch cursordragupdated on move event', () => {
        const onCursorDragUpdated = jest.fn();
        eventBus.subscribe('cursordragupdated', onCursorDragUpdated);

        pointerService.send(pointer.events.down(NONE_POINTER_TARGET));
        pointerService.send(pointer.events.move(NONE_POINTER_TARGET));
        pointerService.send(pointer.events.move(NONE_POINTER_TARGET));

        expect(onCursorDragUpdated).not.toHaveBeenCalled();
      });

      it('does not dispatch cursordragended on exit', () => {
        const onCursorDragEnded = jest.fn();
        eventBus.subscribe('cursordragended', onCursorDragEnded);

        pointerService.send(pointer.events.down(NONE_POINTER_TARGET));
        pointerService.send(pointer.events.move(NONE_POINTER_TARGET));
        pointerService.send(pointer.events.up(NONE_POINTER_TARGET));

        expect(onCursorDragEnded).not.toHaveBeenCalled();
      });
    });
  });
});

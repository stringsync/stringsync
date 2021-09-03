import { MusicDisplayEventBus } from '.';
import { EventBus } from '../EventBus';
import { AnchoredTimeSelection } from './AnchoredTimeSelection';
import { NullCursor } from './NullCursor';
import { createPointerService, pointerModel, PointerService, PointerTargetType } from './pointerMachine';

const NULL_TARGET = { type: PointerTargetType.None } as const;
const CURSOR_TARGET = { type: PointerTargetType.Cursor, cursor: new NullCursor() } as const;
const SELECTION_TARGET = { type: PointerTargetType.Selection, selection: AnchoredTimeSelection.init(0) } as const;

describe('pointerMachine', () => {
  let eventBus: MusicDisplayEventBus;
  let pointerService: PointerService;

  beforeEach(() => {
    jest.useFakeTimers();
    eventBus = new EventBus();
    pointerService = createPointerService(eventBus);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initial', () => {
    it('intializes in the up state', () => {
      expect(pointerService.state.matches('up')).toBeTrue();
    });

    it('initializes with the initial context', () => {
      expect(pointerService.state.context).toStrictEqual(pointerModel.initialContext);
    });
  });

  describe('up', () => {
    it('updates hover context on move event', () => {
      const nextState = pointerService.send(pointerModel.events.move(CURSOR_TARGET));
      expect(nextState.context.hoverTarget).toStrictEqual(CURSOR_TARGET);
    });

    it('dispatches cursorentered events on move event when entering cursor target', () => {
      const onCursorEntered = jest.fn();
      eventBus.subscribe('cursorentered', onCursorEntered);

      pointerService.send(pointerModel.events.move(CURSOR_TARGET));

      expect(onCursorEntered).toHaveBeenCalledTimes(1);
    });

    it('does not dispatch cursorentered events when moving inside same cursor target', () => {
      pointerService.send(pointerModel.events.move(CURSOR_TARGET));

      const onCursorEntered = jest.fn();
      eventBus.subscribe('cursorentered', onCursorEntered);

      pointerService.send(pointerModel.events.move(CURSOR_TARGET));
      pointerService.send(pointerModel.events.move(CURSOR_TARGET));

      expect(onCursorEntered).not.toBeCalled();
    });

    it('dispatches cursorentered events on move event when entering different cursor', () => {
      const cursorTarget1 = CURSOR_TARGET;
      const cursorTarget2 = { type: PointerTargetType.Cursor, cursor: new NullCursor() } as const;

      pointerService.send(pointerModel.events.move(cursorTarget1));

      const onCursorEntered = jest.fn();
      eventBus.subscribe('cursorentered', onCursorEntered);

      pointerService.send(pointerModel.events.move(cursorTarget2));

      expect(onCursorEntered).toHaveBeenCalledTimes(1);
      expect(onCursorEntered).toHaveBeenCalledWith({ cursor: cursorTarget2.cursor });
      const callArgs = onCursorEntered.mock.calls[0][0];
      expect(callArgs.cursor).not.toBe(cursorTarget1.cursor);
      expect(callArgs.cursor).toBe(cursorTarget2.cursor);
    });

    it('dispatches cursorexited events on move event when exiting cursor target', () => {
      const onCursorExited = jest.fn();
      eventBus.subscribe('cursorexited', onCursorExited);

      pointerService.send(pointerModel.events.move(CURSOR_TARGET));
      pointerService.send(pointerModel.events.move(NULL_TARGET));

      expect(onCursorExited).toHaveBeenCalledTimes(1);
    });

    it('does not dispatch cursorexited events on move event when inside same cursor target', () => {
      pointerService.send(pointerModel.events.move(CURSOR_TARGET));

      const onCursorExited = jest.fn();
      eventBus.subscribe('cursorexited', onCursorExited);

      pointerService.send(pointerModel.events.move(CURSOR_TARGET));
      pointerService.send(pointerModel.events.move(CURSOR_TARGET));

      expect(onCursorExited).not.toBeCalled();
    });

    it('dispatches cursorexited events on move event when entering different cursor', () => {
      const cursorTarget1 = CURSOR_TARGET;
      const cursorTarget2 = { type: PointerTargetType.Cursor, cursor: new NullCursor() } as const;

      pointerService.send(pointerModel.events.move(cursorTarget1));

      const onCursorExited = jest.fn();
      eventBus.subscribe('cursorexited', onCursorExited);

      pointerService.send(pointerModel.events.move(cursorTarget2));

      expect(onCursorExited).toHaveBeenCalledTimes(1);
      expect(onCursorExited).toHaveBeenCalledWith({ cursor: cursorTarget1.cursor });
      const callArgs = onCursorExited.mock.calls[0][0];
      expect(callArgs.cursor).not.toBe(cursorTarget2.cursor);
      expect(callArgs.cursor).toBe(cursorTarget1.cursor);
    });

    it('updates down state on down event', () => {
      const nextState = pointerService.send(pointerModel.events.down(CURSOR_TARGET));
      expect(nextState.context.downTarget).toStrictEqual(CURSOR_TARGET);
    });

    it('transitions to down.press state on down', () => {
      const nextState = pointerService.send(pointerModel.events.down(NULL_TARGET));
      expect(nextState.matches('down.press')).toBeTrue();
    });

    it('ignores up events', () => {
      const state = pointerService.state;
      const nextState = pointerService.send(pointerModel.events.up());

      expect(nextState.value).toStrictEqual(state.value);
      expect(nextState.context).toStrictEqual(state.context);
    });

    it('tracks down target history', () => {
      const downTarget = pointerService.state.context.downTarget;
      const nextState = pointerService.send(pointerModel.events.down(CURSOR_TARGET));
      const prevDownTarget = nextState.context.prevDownTarget;
      expect(prevDownTarget).toStrictEqual(downTarget);
    });

    it('tracks hover target history', () => {
      const hoverTarget = pointerService.state.context.hoverTarget;
      const nextState = pointerService.send(pointerModel.events.move(CURSOR_TARGET));
      const prevHoverTarget = nextState.context.prevHoverTarget;
      expect(prevHoverTarget).toStrictEqual(hoverTarget);
    });
  });

  describe('down', () => {
    it('transitions to up state on up event', () => {
      pointerService.send(pointerModel.events.down(NULL_TARGET));
      expect(pointerService.state.matches('down')).toBeTrue();

      pointerService.send(pointerModel.events.up());
      expect(pointerService.state.matches('up')).toBeTrue();
    });

    describe('press', () => {
      it('transitions to longpress after 1 second', () => {
        pointerService.send(pointerModel.events.down(NULL_TARGET));
        jest.advanceTimersByTime(1000);
        expect(pointerService.state.matches('down.longpress')).toBeTrue();
      });

      it('does not transition to longpress before 1 second', () => {
        pointerService.send(pointerModel.events.down(NULL_TARGET));
        jest.advanceTimersByTime(999);
        expect(pointerService.state.matches('down.press')).toBeTrue();
      });

      it('transitions to select state on move event when null target', () => {
        pointerService.send(pointerModel.events.down(NULL_TARGET));
        pointerService.send(pointerModel.events.move(NULL_TARGET));
        expect(pointerService.state.matches('down.select')).toBeTrue();
      });

      it('transitions to drag state on move event when cursor target', () => {
        pointerService.send(pointerModel.events.down(CURSOR_TARGET));
        pointerService.send(pointerModel.events.move(CURSOR_TARGET));
        expect(pointerService.state.matches('down.drag')).toBeTrue();
      });
    });

    describe('longpress', () => {
      it('dispatches longpress event on entry', () => {
        const onLongPress = jest.fn();
        eventBus.subscribe('longpress', onLongPress);

        pointerService.send(pointerModel.events.down(NULL_TARGET));
        jest.advanceTimersByTime(1000);

        expect(onLongPress).toHaveBeenCalledTimes(1);
      });
    });

    describe('drag', () => {
      it('dispatches cursordragstarted on entry', () => {
        const onCursorDragStarted = jest.fn();
        eventBus.subscribe('cursordragstarted', onCursorDragStarted);

        pointerService.send(pointerModel.events.down(CURSOR_TARGET));
        pointerService.send(pointerModel.events.move(CURSOR_TARGET));

        expect(onCursorDragStarted).toHaveBeenCalledTimes(1);
      });

      it('dispatches cursordragupdated on move event', () => {
        const onCursorDragUpdated = jest.fn();
        eventBus.subscribe('cursordragupdated', onCursorDragUpdated);

        pointerService.send(pointerModel.events.down(CURSOR_TARGET));
        pointerService.send(pointerModel.events.move(CURSOR_TARGET));
        pointerService.send(pointerModel.events.move(CURSOR_TARGET));

        expect(onCursorDragUpdated).toHaveBeenCalledTimes(1);
      });

      it('dispatches cursordragended on exit', () => {
        const onCursorDragEnded = jest.fn();
        eventBus.subscribe('cursordragended', onCursorDragEnded);

        pointerService.send(pointerModel.events.down(CURSOR_TARGET));
        pointerService.send(pointerModel.events.move(CURSOR_TARGET));
        pointerService.send(pointerModel.events.up());

        expect(onCursorDragEnded).toHaveBeenCalledTimes(1);
      });

      it('does not dispatch selectionstarted on entry', () => {
        const onSelectionStarted = jest.fn();
        eventBus.subscribe('selectionstarted', onSelectionStarted);

        pointerService.send(pointerModel.events.down(CURSOR_TARGET));
        pointerService.send(pointerModel.events.move(CURSOR_TARGET));

        expect(onSelectionStarted).not.toHaveBeenCalled();
      });

      it('does not dispatch selectionupdated on move event', () => {
        const onSelectionUpdated = jest.fn();
        eventBus.subscribe('selectionupdated', onSelectionUpdated);

        pointerService.send(pointerModel.events.down(CURSOR_TARGET));
        pointerService.send(pointerModel.events.move(CURSOR_TARGET));
        pointerService.send(pointerModel.events.move(CURSOR_TARGET));

        expect(onSelectionUpdated).not.toHaveBeenCalled();
      });

      it('does not dispatch selectionexited on exit', () => {
        const onSelectionUpdated = jest.fn();
        eventBus.subscribe('selectionupdated', onSelectionUpdated);

        pointerService.send(pointerModel.events.down(CURSOR_TARGET));
        pointerService.send(pointerModel.events.move(CURSOR_TARGET));
        pointerService.send(pointerModel.events.up());

        expect(onSelectionUpdated).not.toHaveBeenCalled();
      });
    });

    describe('select', () => {
      it('dispatches selectionstarted on entry', () => {
        const onSelectionStarted = jest.fn();
        eventBus.subscribe('selectionstarted', onSelectionStarted);

        pointerService.send(pointerModel.events.down(SELECTION_TARGET));
        pointerService.send(pointerModel.events.move(NULL_TARGET));

        expect(onSelectionStarted).toHaveBeenCalledTimes(1);
      });

      it('dispatches selectionupdated on move event', () => {
        const onSelectionUpdated = jest.fn();
        eventBus.subscribe('selectionupdated', onSelectionUpdated);

        pointerService.send(pointerModel.events.down(SELECTION_TARGET));
        pointerService.send(pointerModel.events.move(NULL_TARGET));
        pointerService.send(pointerModel.events.move(NULL_TARGET));

        expect(onSelectionUpdated).toHaveBeenCalledTimes(1);
      });

      it('dispatches selectionended on exit', () => {
        const onSelectionEnded = jest.fn();
        eventBus.subscribe('selectionended', onSelectionEnded);

        pointerService.send(pointerModel.events.down(SELECTION_TARGET));
        pointerService.send(pointerModel.events.move(NULL_TARGET));
        pointerService.send(pointerModel.events.up());

        expect(onSelectionEnded).toHaveBeenCalledTimes(1);
      });

      it('does not dispatch cursordragstarted on entry', () => {
        const onCursorDragStarted = jest.fn();
        eventBus.subscribe('cursordragstarted', onCursorDragStarted);

        pointerService.send(pointerModel.events.down(SELECTION_TARGET));
        pointerService.send(pointerModel.events.move(NULL_TARGET));

        expect(onCursorDragStarted).not.toHaveBeenCalled();
      });

      it('does not dispatch cursordragupdated on move event', () => {
        const onCursorDragUpdated = jest.fn();
        eventBus.subscribe('cursordragupdated', onCursorDragUpdated);

        pointerService.send(pointerModel.events.down(SELECTION_TARGET));
        pointerService.send(pointerModel.events.move(NULL_TARGET));
        pointerService.send(pointerModel.events.move(NULL_TARGET));

        expect(onCursorDragUpdated).not.toHaveBeenCalled();
      });

      it('does not dispatch cursordragended on exit', () => {
        const onCursorDragEnded = jest.fn();
        eventBus.subscribe('cursordragended', onCursorDragEnded);

        pointerService.send(pointerModel.events.down(SELECTION_TARGET));
        pointerService.send(pointerModel.events.move(NULL_TARGET));
        pointerService.send(pointerModel.events.up());

        expect(onCursorDragEnded).not.toHaveBeenCalled();
      });
    });
  });
});

import { MusicDisplayEventBus } from '.';
import { EventBus } from '../EventBus';
import { NullCursor } from './NullCursor';
import { createPointerService, pointerModel, PointerService, PointerTargetType } from './pointerMachine';

const NULL_TARGET = { type: PointerTargetType.None } as const;
const CURSOR_TARGET = { type: PointerTargetType.Cursor, cursor: new NullCursor() } as const;

describe('pointerMachine', () => {
  let eventBus: MusicDisplayEventBus;
  let pointerService: PointerService;

  beforeEach(() => {
    eventBus = new EventBus();
    pointerService = createPointerService(eventBus);
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
      expect(onCursorEntered).toHaveBeenCalledWith({ cursor: CURSOR_TARGET.cursor });
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
      expect(onCursorExited).toHaveBeenCalledWith({ cursor: CURSOR_TARGET.cursor });
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

    it('transitions to down.hold state on down', () => {
      const nextState = pointerService.send(pointerModel.events.down(NULL_TARGET));
      expect(nextState.matches('down.hold')).toBeTrue();
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
    it.todo('transitions to up state on up event');

    describe('hold', () => {
      it.todo('transitions into long hold automatically');

      it.todo('responds to move events');
    });

    describe('longHold', () => {
      it.todo('dispatches longholdstarted events on entry');

      it.todo('dispatches longholdended events on exit');
    });

    describe('drag', () => {
      it.todo('dispatches cursordragstarted on entry');

      it.todo('dispatches cursordragupdated on move');

      it.todo('dispatches cursordragended on exit');
    });

    describe('select', () => {
      it.todo('dispatches selectionstarted on entry');

      it.todo('dispatches selectionupdated on move');

      it.todo('dispatches selectionended on exit');
    });
  });
});

import { CursorWrapper, MusicDisplayEventBus } from '.';
import { EventBus } from '../EventBus';
import { createPointerService, pointerModel, PointerService, PointerTargetType } from './pointerMachine';

const NULL_TARGET = { type: PointerTargetType.None } as const;
const CURSOR_TARGET = { type: PointerTargetType.Cursor, cursor: {} as CursorWrapper } as const;

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
    it('updates hover state on move', () => {
      const nextState = pointerService.send(pointerModel.events.move(CURSOR_TARGET));
      expect(nextState.context.hoverTarget).toStrictEqual(CURSOR_TARGET);
    });

    it('dispatches cursorentered events', () => {
      const onCursorEntered = jest.fn();
      eventBus.subscribe('cursorentered', onCursorEntered);

      pointerService.send(pointerModel.events.move(CURSOR_TARGET));

      expect(onCursorEntered).toHaveBeenCalledTimes(1);
      expect(onCursorEntered).toHaveBeenCalledWith({ cursor: CURSOR_TARGET.cursor });
    });

    it('dispatches cursorexited events', () => {
      const onCursorExited = jest.fn();
      eventBus.subscribe('cursorexited', onCursorExited);

      pointerService.send(pointerModel.events.move(CURSOR_TARGET)); // enter
      pointerService.send(pointerModel.events.move(NULL_TARGET));

      expect(onCursorExited).toHaveBeenCalledTimes(1);
      expect(onCursorExited).toHaveBeenCalledWith({ cursor: CURSOR_TARGET.cursor });
    });

    it('updates down state on down', () => {
      const nextState = pointerService.send(pointerModel.events.down(CURSOR_TARGET));
      expect(nextState.context.downTarget).toStrictEqual(CURSOR_TARGET);
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
    it.todo('responds to up events');

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

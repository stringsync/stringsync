import { merge } from 'lodash';
import { ContextFrom, EventFrom, interpret } from 'xstate';
import { assign, choose } from 'xstate/lib/actions';
import { createModel } from 'xstate/lib/model';
import { CursorSnapshot, CursorWrapper } from '.';
import { Duration } from '../../util/Duration';
import { AnchoredTimeSelection } from './AnchoredTimeSelection';
import { MusicDisplayEventBus } from './types';

export enum PointerTargetType {
  None,
  Cursor,
  CursorSnapshot,
  Selection,
}

export type PointerTarget =
  | { type: PointerTargetType.None }
  | { type: PointerTargetType.Cursor; cursor: CursorWrapper }
  | { type: PointerTargetType.CursorSnapshot; cursorSnapshot: CursorSnapshot; timeMs: number }
  | { type: PointerTargetType.Selection; selection: AnchoredTimeSelection };

export type PointerContext = ContextFrom<typeof pointerModel>;
export type PointerEvent = EventFrom<typeof pointerModel>;
export type PointerMachine = ReturnType<typeof createPointerMachine>;
export type PointerService = ReturnType<typeof createPointerService>;

const LONG_HOLD_DURATION = Duration.ms(1000);
const CLICK_GRACE_PERIOD = Duration.ms(100);

const DRAGGABLE_TARGET_TYPES: PointerTargetType[] = [PointerTargetType.Cursor];
const INITIAL_POINTER_CONTEXT: {
  downTarget: PointerTarget;
  prevDownTarget: PointerTarget;
  hoverTarget: PointerTarget;
  prevHoverTarget: PointerTarget;
} = {
  downTarget: { type: PointerTargetType.None },
  prevDownTarget: { type: PointerTargetType.None },
  hoverTarget: { type: PointerTargetType.None },
  prevHoverTarget: { type: PointerTargetType.None },
};

export const pointerModel = createModel(INITIAL_POINTER_CONTEXT, {
  events: {
    up: () => ({}),
    down: (target: PointerTarget) => ({ target }),
    move: (target: PointerTarget) => ({ target }),
  },
});

export const createPointerMachine = (eventBus: MusicDisplayEventBus) => {
  return pointerModel.createMachine(
    {
      id: 'pointer',
      initial: 'up',
      preserveActionOrder: true,
      strict: true,
      states: {
        up: {
          entry: ['reset'],
          on: {
            down: { target: 'down.tap', actions: ['assignDownTarget'] },
            move: {
              actions: [
                'assignHoverTarget',
                choose([{ cond: 'didCursorEnter', actions: ['dispatchCursorEntered'] }]),
                choose([{ cond: 'didCursorExit', actions: ['dispatchCursorExited'] }]),
              ],
            },
          },
        },
        down: {
          on: { up: { target: '#pointer.up' } },
          states: {
            tap: {
              after: { [CLICK_GRACE_PERIOD.ms]: { target: 'press' } },
              on: { up: { target: '#pointer.up', actions: ['dispatchClick'] } },
            },
            press: {
              after: { [LONG_HOLD_DURATION.ms - CLICK_GRACE_PERIOD.ms]: { target: 'longpress' } },
              on: {
                up: { target: '#pointer.up', actions: ['dispatchClick'] },
                move: [{ cond: 'hasDraggableDownTarget', target: 'drag' }, { target: 'select' }],
              },
            },
            longpress: {
              entry: ['dispatchLongPress'],
            },
            drag: {
              entry: ['dispatchDragStarted'],
              on: { move: { actions: ['dispatchDragUpdated'] } },
              exit: ['dispatchDragEnded'],
            },
            select: {
              entry: ['dispatchSelectStarted'],
              on: { move: { actions: ['dispatchSelectUpdated'] } },
              exit: ['dispatchSelectEnded'],
            },
          },
        },
      },
    },
    {
      actions: {
        reset: assign((context) => merge({}, INITIAL_POINTER_CONTEXT)),
        assignDownTarget: assign<PointerContext, PointerEvent>({
          downTarget: (context, event) => {
            switch (event.type) {
              case 'down':
                return event.target;
              default:
                return { type: PointerTargetType.None };
            }
          },
          prevDownTarget: (context) => context.downTarget,
        }),
        assignHoverTarget: assign<PointerContext, PointerEvent>({
          hoverTarget: (context, event) => {
            switch (event.type) {
              case 'move':
                return event.target;
              default:
                return { type: PointerTargetType.None };
            }
          },
          prevHoverTarget: (context) => context.hoverTarget,
        }),
        dispatchClick: (context) => {
          if (context.downTarget.type === PointerTargetType.CursorSnapshot) {
            eventBus.dispatch('cursorsnapshotclicked', {
              cursorSnapshot: context.downTarget.cursorSnapshot,
              timeMs: context.downTarget.timeMs,
            });
          }
        },
        dispatchDragStarted: (context) => {
          if (context.downTarget.type === PointerTargetType.Cursor) {
            eventBus.dispatch('cursordragstarted', { cursor: context.downTarget.cursor });
          }
        },
        dispatchDragUpdated: (context) => {
          if (context.downTarget.type === PointerTargetType.Cursor) {
            eventBus.dispatch('cursordragupdated', { cursor: context.downTarget.cursor });
          }
        },
        dispatchDragEnded: (context) => {
          if (context.downTarget.type === PointerTargetType.Cursor) {
            eventBus.dispatch('cursordragended', { cursor: context.downTarget.cursor });
          }
        },
        dispatchSelectStarted: (context) => {
          if (context.downTarget.type === PointerTargetType.Selection) {
            eventBus.dispatch('selectionstarted', { selection: context.downTarget.selection });
          }
        },
        dispatchSelectUpdated: (context) => {
          if (context.downTarget.type === PointerTargetType.Selection) {
            eventBus.dispatch('selectionupdated', { selection: context.downTarget.selection });
          }
        },
        dispatchSelectEnded: (context) => {
          if (context.downTarget.type === PointerTargetType.Selection) {
            eventBus.dispatch('selectionended', { selection: context.downTarget.selection });
          }
        },
        dispatchCursorEntered: (context, event) => {
          if (context.hoverTarget.type === PointerTargetType.Cursor) {
            eventBus.dispatch('cursorentered', { cursor: context.hoverTarget.cursor });
          }
        },
        dispatchCursorExited: (context, event) => {
          if (context.prevHoverTarget.type === PointerTargetType.Cursor) {
            eventBus.dispatch('cursorexited', { cursor: context.prevHoverTarget.cursor });
          }
        },
        dispatchLongPress: (context, event) => {
          eventBus.dispatch('longpress', {});
        },
      },
      guards: {
        hasDraggableDownTarget: (context) => {
          return DRAGGABLE_TARGET_TYPES.includes(context.downTarget.type);
        },
        didCursorEnter: (context) => {
          if (context.hoverTarget.type !== PointerTargetType.Cursor) {
            return false;
          }
          if (context.prevHoverTarget.type !== PointerTargetType.Cursor) {
            return true;
          }
          return context.hoverTarget.cursor !== context.prevHoverTarget.cursor;
        },
        didCursorExit: (context) => {
          if (context.prevHoverTarget.type !== PointerTargetType.Cursor) {
            return false;
          }
          if (context.hoverTarget.type !== PointerTargetType.Cursor) {
            return true;
          }
          return context.prevHoverTarget.cursor !== context.hoverTarget.cursor;
        },
      },
    }
  );
};

export const createPointerService = (eventBus: MusicDisplayEventBus) => {
  const pointerMachine = createPointerMachine(eventBus);
  const pointerService = interpret(pointerMachine);
  pointerService.start();
  return pointerService;
};

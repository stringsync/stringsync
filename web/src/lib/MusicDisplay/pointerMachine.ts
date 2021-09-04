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
}

type NonePointerTarget = { type: PointerTargetType.None };

type CursorPointerTarget = { type: PointerTargetType.Cursor; cursor: CursorWrapper; timeMs: number };

type CursorSnapshotPointerTarget = {
  type: PointerTargetType.CursorSnapshot;
  cursorSnapshot: CursorSnapshot;
  timeMs: number;
};

export type PointerTarget = NonePointerTarget | CursorPointerTarget | CursorSnapshotPointerTarget;

export type PointerContext = ContextFrom<typeof pointerModel>;
export type PointerEvent = EventFrom<typeof pointerModel>;
export type PointerMachine = ReturnType<typeof createPointerMachine>;
export type PointerService = ReturnType<typeof createPointerService>;

type UnknownTarget = {
  type: PointerTargetType;
};

const isCursorPointerTarget = (value: UnknownTarget): value is CursorPointerTarget => {
  return value.type === PointerTargetType.Cursor;
};
const isCursorSnapshotPointerTarget = (value: UnknownTarget): value is CursorSnapshotPointerTarget => {
  return value.type === PointerTargetType.CursorSnapshot;
};

const LONG_HOLD_DURATION = Duration.ms(1000);
const TAP_GRACE_PERIOD = Duration.ms(50);
const INITIAL_POINTER_CONTEXT: {
  downTarget: PointerTarget;
  prevDownTarget: PointerTarget;
  hoverTarget: PointerTarget;
  prevHoverTarget: PointerTarget;
  selection: AnchoredTimeSelection | null;
} = {
  downTarget: { type: PointerTargetType.None },
  prevDownTarget: { type: PointerTargetType.None },
  hoverTarget: { type: PointerTargetType.None },
  prevHoverTarget: { type: PointerTargetType.None },
  selection: null,
};

export const pointerModel = createModel(INITIAL_POINTER_CONTEXT, {
  events: {
    up: (target: PointerTarget) => ({ target }),
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
            down: [
              { cond: 'hasDraggableDownTarget', target: 'down.drag', actions: ['assignDownTarget'] },
              { target: 'down.tap', actions: ['assignDownTarget'] },
            ],
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
              after: { [TAP_GRACE_PERIOD.ms]: { target: 'press' } },
              on: { up: { target: '#pointer.up', actions: ['dispatchClick'] } },
            },
            press: {
              after: { [LONG_HOLD_DURATION.ms - TAP_GRACE_PERIOD.ms]: { target: 'longpress' } },
              on: {
                up: { target: '#pointer.up', actions: ['dispatchClick'] },
                move: { target: 'select' },
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
              entry: ['initSelection', 'dispatchSelectStarted'],
              on: { move: { actions: ['updateSelection', 'dispatchSelectUpdated'] } },
              exit: ['clearSelection', 'dispatchSelectEnded'],
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
        initSelection: assign<PointerContext, PointerEvent>({
          selection: (context, event) => {
            if (event.type === 'move' && isCursorSnapshotPointerTarget(event.target)) {
              return AnchoredTimeSelection.init(event.target.timeMs);
            }
            return context.selection;
          },
        }),
        updateSelection: assign<PointerContext, PointerEvent>({
          selection: (context, event) => {
            if (event.type === 'move' && isCursorSnapshotPointerTarget(event.target) && context.selection) {
              return context.selection.update(event.target.timeMs);
            }
            return context.selection;
          },
        }),
        clearSelection: assign<PointerContext, PointerEvent>({
          selection: null,
        }),
        dispatchClick: (context) => {
          if (isCursorSnapshotPointerTarget(context.downTarget)) {
            eventBus.dispatch('cursorsnapshotclicked', {
              cursorSnapshot: context.downTarget.cursorSnapshot,
              timeMs: context.downTarget.timeMs,
            });
          }
        },
        dispatchDragStarted: (context, event) => {
          if (event.type === 'down' && isCursorPointerTarget(context.downTarget)) {
            eventBus.dispatch('cursordragstarted', { cursor: context.downTarget.cursor });
          }
        },
        dispatchDragUpdated: (context, event) => {
          if (isCursorPointerTarget(context.downTarget) && isCursorSnapshotPointerTarget(event.target)) {
            eventBus.dispatch('cursordragupdated', { cursor: context.downTarget.cursor, timeMs: event.target.timeMs });
          }
        },
        dispatchDragEnded: (context, event) => {
          if (isCursorPointerTarget(context.downTarget) && isCursorSnapshotPointerTarget(event.target)) {
            eventBus.dispatch('cursordragended', { cursor: context.downTarget.cursor, timeMs: event.target.timeMs });
          }
        },
        dispatchSelectStarted: (context) => {
          if (context.selection) {
            eventBus.dispatch('selectionstarted', { selection: context.selection });
          }
        },
        dispatchSelectUpdated: (context) => {
          if (context.selection) {
            eventBus.dispatch('selectionupdated', { selection: context.selection });
          }
        },
        dispatchSelectEnded: (context) => {
          if (context.selection) {
            eventBus.dispatch('selectionended', { selection: context.selection });
          }
        },
        dispatchCursorEntered: (context, event) => {
          if (isCursorPointerTarget(context.hoverTarget)) {
            eventBus.dispatch('cursorentered', { cursor: context.hoverTarget.cursor });
          }
        },
        dispatchCursorExited: (context, event) => {
          if (isCursorPointerTarget(context.prevHoverTarget)) {
            eventBus.dispatch('cursorexited', { cursor: context.prevHoverTarget.cursor });
          }
        },
        dispatchLongPress: () => {
          eventBus.dispatch('longpress', {});
        },
      },
      guards: {
        hasDraggableDownTarget: (context, event) => {
          return event.type === 'down' && isCursorPointerTarget(event.target);
        },
        didCursorEnter: (context) => {
          if (!isCursorPointerTarget(context.hoverTarget)) {
            return false;
          }
          if (!isCursorPointerTarget(context.prevHoverTarget)) {
            return true;
          }
          return context.hoverTarget.cursor !== context.prevHoverTarget.cursor;
        },
        didCursorExit: (context) => {
          if (!isCursorPointerTarget(context.prevHoverTarget)) {
            return false;
          }
          if (!isCursorPointerTarget(context.hoverTarget)) {
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

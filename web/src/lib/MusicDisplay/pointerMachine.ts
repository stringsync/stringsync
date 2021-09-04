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

const isNonePointerTarget = (target: UnknownTarget): target is CursorPointerTarget => {
  return target.type === PointerTargetType.None;
};
const isCursorPointerTarget = (target: UnknownTarget): target is CursorPointerTarget => {
  return target.type === PointerTargetType.Cursor;
};
const isCursorSnapshotPointerTarget = (target: UnknownTarget): target is CursorSnapshotPointerTarget => {
  return target.type === PointerTargetType.CursorSnapshot;
};

const LONG_HOLD_DURATION = Duration.ms(1000);
const TAP_GRACE_PERIOD = Duration.ms(50);
const IDLE_DURATION = Duration.ms(500);

const INITIAL_POINTER_CONTEXT: {
  isActive: boolean;
  downTarget: PointerTarget;
  prevDownTarget: PointerTarget;
  hoverTarget: PointerTarget;
  prevHoverTarget: PointerTarget;
  selection: AnchoredTimeSelection | null;
} = {
  isActive: true,
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
    ping: (target: PointerTarget) => ({ target }),
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
          initial: 'idle',
          on: {
            down: [
              { cond: 'hasDraggableTarget', target: 'down.drag', actions: ['assignDownTarget'] },
              { target: 'down.tap', actions: ['assignDownTarget'] },
            ],
            move: {
              target: 'up.active',
              actions: [
                'assignHoverTarget',
                choose([
                  { cond: 'hasNoTarget', actions: ['dispatchNoTargetEntered'] },
                  { actions: 'dispatchNoTargetExited' },
                ]),
                choose([
                  { cond: 'didEnterCursor', actions: ['dispatchCursorEntered'] },
                  { cond: 'didEnterCursorSnapshot', actions: ['dispatchCursorSnapshotEntered'] },
                ]),
                choose([
                  { cond: 'didExitCursor', actions: ['dispatchCursorExited'] },
                  { cond: 'didExitCursorSnapshot', actions: ['dispatchCursorSnapshotExited'] },
                ]),
              ],
            },
          },
          states: {
            active: {
              after: { [IDLE_DURATION.ms]: { target: 'idle' } },
              entry: ['dispatchPointerActive', 'markAsActive'],
            },
            idle: {
              entry: ['dispatchPointerIdle', 'markAsIdle'],
              on: {
                ping: {
                  actions: [
                    'assignHoverTarget',
                    choose([
                      { cond: 'didEnterCursor', actions: ['dispatchCursorEntered'] },
                      { cond: 'didEnterCursorSnapshot', actions: ['dispatchCursorSnapshotEntered'] },
                    ]),
                    choose([
                      { cond: 'didExitCursor', actions: ['dispatchCursorExited'] },
                      { cond: 'didExitCursorSnapshot', actions: ['dispatchCursorSnapshotExited'] },
                    ]),
                  ],
                },
              },
            },
          },
        },
        down: {
          on: {
            up: { target: '#pointer.up', actions: ['resetDownTarget'] },
            move: { actions: ['assignHoverTarget'] },
          },
          states: {
            tap: {
              after: { [TAP_GRACE_PERIOD.ms]: { target: 'press' } },
              on: { up: { target: '#pointer.up', actions: ['dispatchClick', 'resetDownTarget'] } },
            },
            press: {
              after: { [LONG_HOLD_DURATION.ms - TAP_GRACE_PERIOD.ms]: { target: 'longpress' } },
              on: {
                up: { target: '#pointer.up', actions: ['dispatchClick'] },
                move: { target: 'select', actions: ['assignHoverTarget'] },
              },
            },
            longpress: {
              entry: ['dispatchLongPress'],
            },
            drag: {
              entry: ['dispatchDragStarted'],
              on: { move: { actions: ['assignHoverTarget', 'dispatchDragUpdated'] } },
              exit: ['dispatchDragEnded'],
            },
            select: {
              entry: ['initSelection', 'dispatchSelectStarted'],
              on: { move: { actions: ['assignHoverTarget', 'updateSelection', 'dispatchSelectUpdated'] } },
              exit: ['clearSelection', 'dispatchSelectEnded'],
            },
          },
        },
      },
    },
    {
      actions: {
        resetDownTarget: assign<PointerContext, PointerEvent>({
          downTarget: (context, event) => merge({}, INITIAL_POINTER_CONTEXT.downTarget),
        }),
        markAsActive: assign<PointerContext, PointerEvent>({
          isActive: true,
        }),
        markAsIdle: assign<PointerContext, PointerEvent>({
          isActive: false,
        }),
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
              case 'ping':
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
          if (isCursorPointerTarget(context.downTarget)) {
            eventBus.dispatch('cursordragended', {
              cursor: context.downTarget.cursor,
              hoveredCursor: isCursorPointerTarget(context.hoverTarget) ? context.hoverTarget.cursor : null,
            });
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
        dispatchSelectEnded: () => {
          eventBus.dispatch('selectionended', {});
        },
        dispatchCursorEntered: (context) => {
          if (isCursorPointerTarget(context.hoverTarget)) {
            eventBus.dispatch('cursorentered', { cursor: context.hoverTarget.cursor });
          }
        },
        dispatchCursorExited: (context) => {
          if (isCursorPointerTarget(context.prevHoverTarget)) {
            eventBus.dispatch('cursorexited', { cursor: context.prevHoverTarget.cursor });
          }
        },
        dispatchCursorSnapshotEntered: (context) => {
          if (isCursorSnapshotPointerTarget(context.hoverTarget)) {
            eventBus.dispatch('cursorsnapshotentered', {
              cursorSnapshot: context.hoverTarget.cursorSnapshot,
              timeMs: context.hoverTarget.timeMs,
            });
          }
        },
        dispatchCursorSnapshotExited: (context) => {
          if (isCursorSnapshotPointerTarget(context.prevHoverTarget)) {
            eventBus.dispatch('cursorsnapshotexited', {
              cursorSnapshot: context.prevHoverTarget.cursorSnapshot,
              timeMs: context.prevHoverTarget.timeMs,
            });
          }
        },
        dispatchLongPress: () => {
          eventBus.dispatch('longpress', {});
        },
        dispatchNoTargetEntered: () => {
          eventBus.dispatch('notargetentered', {});
        },
        dispatchNoTargetExited: () => {
          eventBus.dispatch('notargetexited', {});
        },
        dispatchPointerIdle: (context) => {
          if (context.isActive) {
            eventBus.dispatch('pointeridle', {});
          }
        },
        dispatchPointerActive: (context) => {
          if (!context.isActive) {
            eventBus.dispatch('pointeractive', {});
          }
        },
      },
      guards: {
        hasDraggableTarget: (context, event) => {
          return isCursorPointerTarget(event.target);
        },
        hasNoTarget: (context, event) => {
          return isNonePointerTarget(event.target);
        },
        didEnterCursor: (context) => {
          if (!isCursorPointerTarget(context.hoverTarget)) {
            return false;
          }
          if (!isCursorPointerTarget(context.prevHoverTarget)) {
            return true;
          }
          return context.hoverTarget.cursor !== context.prevHoverTarget.cursor;
        },
        didExitCursor: (context) => {
          if (!isCursorPointerTarget(context.prevHoverTarget)) {
            return false;
          }
          if (!isCursorPointerTarget(context.hoverTarget)) {
            return true;
          }
          return context.prevHoverTarget.cursor !== context.hoverTarget.cursor;
        },
        didEnterCursorSnapshot: (context) => {
          if (!isCursorSnapshotPointerTarget(context.hoverTarget)) {
            return false;
          }
          if (!isCursorSnapshotPointerTarget(context.prevHoverTarget)) {
            return true;
          }
          return context.hoverTarget.cursorSnapshot !== context.prevHoverTarget.cursorSnapshot;
        },
        didExitCursorSnapshot: (context) => {
          if (!isCursorSnapshotPointerTarget(context.prevHoverTarget)) {
            return false;
          }
          if (!isCursorSnapshotPointerTarget(context.hoverTarget)) {
            return true;
          }
          return context.prevHoverTarget.cursorSnapshot !== context.hoverTarget.cursorSnapshot;
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

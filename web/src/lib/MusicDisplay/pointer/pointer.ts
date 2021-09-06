import { merge } from 'lodash';
import { EventFrom, interpret } from 'xstate';
import { assign, choose } from 'xstate/lib/actions';
import { createModel } from 'xstate/lib/model';
import { NonePointerTarget } from '.';
import { MusicDisplayEventBus } from '..';
import { Duration } from '../../../util/Duration';
import { AnchoredTimeSelection } from '../AnchoredTimeSelection';
import {
  isCursorPointerTarget,
  isCursorSnapshotPointerTarget,
  isNonePointerTarget,
  isPositional,
  isSeekable,
} from './pointerTypeAssert';
import { PointerContext, PointerPosition, PointerTarget, PointerTargetType } from './types';

export type PointerEvent = EventFrom<typeof model>;
export type PointerMachine = ReturnType<typeof createMachine>;
export type PointerService = ReturnType<typeof createService>;

const LONG_HOLD_DURATION = Duration.ms(1000);
const TAP_GRACE_PERIOD = Duration.ms(50);
const IDLE_DURATION = Duration.ms(500);

const NULL_POINTER_POSITION: PointerPosition = Object.freeze({
  x: 0,
  y: 0,
  relX: 0,
  relY: 0,
});

const NONE_POINTER_TARGET: NonePointerTarget = Object.freeze({
  type: PointerTargetType.None,
  position: NULL_POINTER_POSITION,
});

const INITIAL_POINTER_CONTEXT: PointerContext = {
  downTarget: NONE_POINTER_TARGET,
  prevDownTarget: NONE_POINTER_TARGET,
  hoverTarget: NONE_POINTER_TARGET,
  prevHoverTarget: NONE_POINTER_TARGET,
  selection: null,
};

export const model = createModel(INITIAL_POINTER_CONTEXT, {
  events: {
    up: (target: PointerTarget) => ({ target }),
    down: (target: PointerTarget) => ({ target }),
    move: (target: PointerTarget) => ({ target }),
    ping: (target: PointerTarget) => ({ target }),
  },
});

export const events = model.events;

export const createMachine = (eventBus: MusicDisplayEventBus) => {
  return model.createMachine(
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
              entry: ['dispatchPointerActive'],
            },
            idle: {
              entry: ['dispatchPointerIdle'],
              on: {
                ping: {
                  actions: [
                    'assignHoverTarget',
                    choose([{ cond: 'didEnterCursor', actions: ['dispatchCursorEntered'] }]),
                    choose([{ cond: 'didExitCursor', actions: ['dispatchCursorExited'] }]),
                  ],
                },
              },
            },
          },
        },
        down: {
          on: {
            up: { target: '#pointer.up.active', actions: ['resetDownTarget'] },
            move: { actions: ['assignHoverTarget'] },
          },
          states: {
            tap: {
              after: { [TAP_GRACE_PERIOD.ms]: { target: 'press' } },
              on: { up: { target: '#pointer.up.active', actions: ['dispatchClick', 'resetDownTarget'] } },
            },
            press: {
              after: { [LONG_HOLD_DURATION.ms - TAP_GRACE_PERIOD.ms]: { target: 'longpress' } },
              on: {
                up: { target: '#pointer.up.active', actions: ['dispatchClick'] },
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
              entry: ['startSelection', 'dispatchSelectStarted'],
              on: { move: { actions: ['assignHoverTarget', 'updateSelection', 'dispatchSelectUpdated'] } },
              exit: ['endSelection', 'dispatchSelectEnded'],
            },
          },
        },
      },
    },
    {
      actions: {
        resetDownTarget: assign<PointerContext, PointerEvent>({
          downTarget: () => merge({}, INITIAL_POINTER_CONTEXT.downTarget),
        }),
        assignDownTarget: assign<PointerContext, PointerEvent>({
          downTarget: (context, event) => event.target,
          prevDownTarget: (context) => context.downTarget,
        }),
        assignHoverTarget: assign<PointerContext, PointerEvent>({
          hoverTarget: (context, event) => event.target,
          prevHoverTarget: (context) => context.hoverTarget,
        }),
        startSelection: assign<PointerContext, PointerEvent>({
          selection: (context, event) => {
            return isCursorSnapshotPointerTarget(event.target)
              ? AnchoredTimeSelection.init(event.target.timeMs)
              : context.selection;
          },
        }),
        updateSelection: assign<PointerContext, PointerEvent>({
          selection: (context, event) => {
            return isCursorSnapshotPointerTarget(event.target) && context.selection
              ? context.selection.update(event.target.timeMs)
              : context.selection;
          },
        }),
        endSelection: assign<PointerContext, PointerEvent>({
          selection: null,
        }),
        dispatchClick: (context, event) => {
          if (isCursorSnapshotPointerTarget(context.downTarget)) {
            eventBus.dispatch('cursorsnapshotclicked', { target: context.downTarget });
          }
        },
        dispatchDragStarted: (context, event) => {
          if (isCursorPointerTarget(context.downTarget)) {
            eventBus.dispatch('cursordragstarted', { downTarget: context.downTarget });
          }
        },
        dispatchDragUpdated: (context, event) => {
          if (isCursorPointerTarget(context.downTarget)) {
            const target = { ...context.downTarget };
            if (isSeekable(event.target)) {
              target.timeMs = event.target.timeMs;
            }
            if (isPositional(event.target)) {
              target.position = event.target.position;
            }
            eventBus.dispatch('cursordragupdated', { downTarget: context.downTarget, eventTarget: event.target });
          }
        },
        dispatchDragEnded: (context, event) => {
          if (isCursorPointerTarget(context.downTarget)) {
            eventBus.dispatch('cursordragended', { downTarget: context.downTarget, eventTarget: context.hoverTarget });
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
            eventBus.dispatch('cursorentered', { target: context.hoverTarget });
          }
        },
        dispatchCursorExited: (context) => {
          if (isCursorPointerTarget(context.prevHoverTarget)) {
            eventBus.dispatch('cursorexited', { target: context.prevHoverTarget });
          }
        },
        dispatchCursorSnapshotEntered: (context) => {
          if (isCursorSnapshotPointerTarget(context.hoverTarget)) {
            eventBus.dispatch('cursorsnapshotentered', { target: context.hoverTarget });
          }
        },
        dispatchCursorSnapshotExited: (context) => {
          if (isCursorSnapshotPointerTarget(context.prevHoverTarget)) {
            eventBus.dispatch('cursorsnapshotexited', { target: context.prevHoverTarget });
          }
        },
        dispatchLongPress: () => {
          eventBus.dispatch('longpress', {});
        },
        dispatchNoTargetEntered: (context, event) => {
          if (isNonePointerTarget(event.target)) {
            eventBus.dispatch('notargetentered', { target: event.target });
          }
        },
        dispatchNoTargetExited: (context, event) => {
          if (isNonePointerTarget(event.target)) {
            eventBus.dispatch('notargetexited', { target: event.target });
          }
        },
        dispatchPointerIdle: (context) => {
          eventBus.dispatch('pointeridle', {});
        },
        dispatchPointerActive: (context) => {
          eventBus.dispatch('pointeractive', {});
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

export const createService = (eventBus: MusicDisplayEventBus) => {
  const pointerMachine = createMachine(eventBus);
  const pointerService = interpret(pointerMachine);
  pointerService.start();
  return pointerService;
};

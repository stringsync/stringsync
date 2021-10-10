import { merge } from 'lodash';
import { EventFrom, interpret } from 'xstate';
import { assign, choose } from 'xstate/lib/actions';
import { createModel } from 'xstate/lib/model';
import { AnchoredSelection } from '../../../util/AnchoredSelection';
import { Duration } from '../../../util/Duration';
import { MusicDisplayEventBus } from '../types';
import {
  isCursorPointerTarget,
  isCursorSnapshotPointerTarget,
  isNonePointerTarget,
  isSelectionPointerTarget,
  isTemporal,
} from './pointerTypeAssert';
import { NonePointerTarget, PointerContext, PointerPosition, PointerTarget, PointerTargetType } from './types';

export type PointerEvent = EventFrom<typeof model>;
export type PointerMachine = ReturnType<typeof createMachine>;
export type PointerService = ReturnType<typeof createService>;

export const LONG_PRESS_DURATION = Duration.ms(1000);
export const DOWN_START_DURATION = Duration.ms(30);
export const IDLE_DURATION = Duration.ms(500);

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
    mousedown: (target: PointerTarget) => ({ target }),
    mousemove: (target: PointerTarget) => ({ target }),
    mouseup: (target: PointerTarget) => ({ target }),
    touchstart: (target: PointerTarget) => ({ target }),
    touchmove: (target: PointerTarget) => ({ target }),
    touchend: (target: PointerTarget) => ({ target }),
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
            mousedown: [
              {
                cond: 'hasSelectableTarget',
                target: 'down.select',
                actions: ['assignDownTarget', 'dispatchPointerDown'],
              },
              {
                cond: 'hasDraggableTarget',
                target: 'down.drag',
                actions: ['assignDownTarget', 'dispatchPointerDown'],
              },
              {
                target: 'down.start',
                actions: ['assignDownTarget', 'dispatchPointerDown'],
              },
            ],
            mousemove: {
              target: 'up.active',
              actions: [
                'assignHoverTarget',
                choose([
                  { cond: 'hasNoTarget', actions: ['dispatchNoTargetEntered'] },
                  { actions: 'dispatchNoTargetExited' },
                ]),
                choose([
                  { cond: 'didEnterSelection', actions: ['dispatchSelectEntered'] },
                  { cond: 'didEnterCursor', actions: ['dispatchCursorEntered'] },
                  { cond: 'didEnterCursorSnapshot', actions: ['dispatchCursorSnapshotEntered'] },
                ]),
                choose([
                  { cond: 'didExitSelection', actions: ['dispatchSelectExited'] },
                  { cond: 'didExitCursor', actions: ['dispatchCursorExited'] },
                  { cond: 'didExitCursorSnapshot', actions: ['dispatchCursorSnapshotExited'] },
                ]),
              ],
            },
            touchstart: {
              target: 'down.start',
              actions: ['assignDownTarget'],
            },
            touchmove: {
              target: 'up.active',
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
                    choose([
                      { cond: 'didEnterSelection', actions: ['dispatchSelectEntered'] },
                      { cond: 'didEnterCursor', actions: ['dispatchCursorEntered'] },
                    ]),
                    choose([
                      { cond: 'didExitSelection', actions: ['dispatchSelectExited'] },
                      { cond: 'didExitCursor', actions: ['dispatchCursorExited'] },
                    ]),
                  ],
                },
              },
            },
          },
        },
        down: {
          on: {
            mouseup: { target: '#pointer.up.active', actions: ['resetDownTarget'] },
            mousemove: { actions: ['assignHoverTarget'] },
            touchend: { target: '#pointer.up.active', actions: ['resetDownTarget', 'resetHoverTarget'] },
            touchmove: { actions: ['assignHoverTarget'] },
          },
          states: {
            start: {
              after: { [DOWN_START_DURATION.ms]: { target: 'press' } },
              on: {
                // Assume that the user is scrolling if they touchmove immediately
                // (as determined by DOWN_START_DURATION) after entering the down.start state. The user will need to
                // emit another touchstart event to get the machine to do anything in the down.* states.
                touchmove: { target: '#pointer.up.active', actions: ['resetDownTarget'] },
              },
            },
            press: {
              entry: ['dispatchPointerDown'],
              after: { [LONG_PRESS_DURATION.ms - DOWN_START_DURATION.ms]: { target: 'longpress' } },
              on: {
                mouseup: { target: '#pointer.up.active', actions: ['dispatchClick', 'resetDownTarget'] },
                mousemove: { target: 'select', actions: ['assignHoverTarget'] },
                touchend: { target: '#pointer.up.active', actions: ['dispatchClick', 'resetDownTarget'] },
                touchmove: { target: 'select', actions: ['assignHoverTarget'] },
              },
            },
            longpress: {
              entry: ['dispatchLongPress'],
            },
            drag: {
              entry: ['dispatchDragStarted'],
              on: {
                mousemove: { actions: ['assignHoverTarget', 'dispatchDragUpdated'] },
                touchmove: { actions: ['assignHoverTarget', 'dispatchDragUpdated'] },
              },
              exit: ['dispatchDragEnded'],
            },
            select: {
              entry: ['startSelection', 'dispatchSelectStarted'],
              on: {
                mousemove: {
                  actions: [
                    'assignHoverTarget',
                    'updateSelection',
                    'dispatchSelectUpdated',
                    choose([{ cond: 'didEnterSelection', actions: ['dispatchSelectEntered'] }]),
                    choose([{ cond: 'didExitSelection', actions: ['dispatchSelectExited'] }]),
                  ],
                },
                touchmove: {
                  actions: [
                    'assignHoverTarget',
                    'updateSelection',
                    'dispatchSelectUpdated',
                    choose([{ cond: 'didEnterSelection', actions: ['dispatchSelectEntered'] }]),
                    choose([{ cond: 'didExitSelection', actions: ['dispatchSelectExited'] }]),
                  ],
                },
              },
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
        resetHoverTarget: assign<PointerContext, PointerEvent>({
          hoverTarget: () => merge({}, INITIAL_POINTER_CONTEXT.hoverTarget),
        }),
        startSelection: assign<PointerContext, PointerEvent>({
          selection: (context, event) => {
            if (isCursorSnapshotPointerTarget(event.target)) {
              return AnchoredSelection.init(event.target.timeMs);
            }
            if (isSelectionPointerTarget(event.target)) {
              return event.target.selection;
            }
            return context.selection;
          },
        }),
        updateSelection: assign<PointerContext, PointerEvent>({
          selection: (context, event) => {
            return isTemporal(event.target) && context.selection
              ? context.selection.update(event.target.timeMs)
              : context.selection;
          },
        }),
        endSelection: assign<PointerContext, PointerEvent>({
          selection: null,
        }),
        dispatchClick: (context, event) => {
          eventBus.dispatch('click', { src: context.downTarget });
        },
        dispatchDragStarted: (context, event) => {
          if (isCursorPointerTarget(context.downTarget)) {
            eventBus.dispatch('cursordragstarted', { src: context.downTarget });
          }
        },
        dispatchDragUpdated: (context, event) => {
          if (isCursorPointerTarget(context.downTarget)) {
            eventBus.dispatch('cursordragupdated', { src: context.downTarget, dst: event.target });
          }
        },
        dispatchDragEnded: (context, event) => {
          if (isCursorPointerTarget(context.downTarget)) {
            eventBus.dispatch('cursordragended', { src: context.downTarget, dst: context.hoverTarget });
          }
        },
        dispatchSelectEntered: (context) => {
          if (isSelectionPointerTarget(context.hoverTarget)) {
            eventBus.dispatch('selectionentered', { src: context.hoverTarget });
          }
        },
        dispatchSelectExited: (context) => {
          if (isSelectionPointerTarget(context.prevHoverTarget)) {
            eventBus.dispatch('selectionexited', { src: context.prevHoverTarget });
          }
        },
        dispatchSelectStarted: (context) => {
          if (context.selection) {
            eventBus.dispatch('selectionstarted', { src: context.downTarget, selection: context.selection });
          }
        },
        dispatchSelectUpdated: (context, event) => {
          if (context.selection) {
            eventBus.dispatch('selectionupdated', {
              src: context.downTarget,
              dst: event.target,
              selection: context.selection,
            });
          }
        },
        dispatchSelectEnded: (context, event) => {
          eventBus.dispatch('selectionended', { src: context.downTarget, dst: event.target });
        },
        dispatchCursorEntered: (context) => {
          if (isCursorPointerTarget(context.hoverTarget)) {
            eventBus.dispatch('cursorentered', { src: context.hoverTarget });
          }
        },
        dispatchCursorExited: (context) => {
          if (isCursorPointerTarget(context.prevHoverTarget)) {
            eventBus.dispatch('cursorexited', { src: context.prevHoverTarget });
          }
        },
        dispatchCursorSnapshotEntered: (context) => {
          if (isCursorSnapshotPointerTarget(context.hoverTarget)) {
            eventBus.dispatch('cursorsnapshotentered', { src: context.hoverTarget });
          }
        },
        dispatchCursorSnapshotExited: (context) => {
          if (isCursorSnapshotPointerTarget(context.prevHoverTarget)) {
            eventBus.dispatch('cursorsnapshotexited', { src: context.prevHoverTarget });
          }
        },
        dispatchLongPress: () => {
          eventBus.dispatch('longpress', {});
        },
        dispatchNoTargetEntered: (context, event) => {
          if (isNonePointerTarget(event.target)) {
            eventBus.dispatch('notargetentered', { src: event.target });
          }
        },
        dispatchNoTargetExited: (context, event) => {
          if (isNonePointerTarget(event.target)) {
            eventBus.dispatch('notargetexited', { src: event.target });
          }
        },
        dispatchPointerDown: (context) => {
          eventBus.dispatch('pointerdown', { src: context.downTarget });
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
        hasSelectableTarget: (context, event) => {
          return isSelectionPointerTarget(event.target);
        },
        hasNoTarget: (context, event) => {
          return isNonePointerTarget(event.target);
        },
        didEnterSelection: (context) => {
          if (!isSelectionPointerTarget(context.hoverTarget)) {
            return false;
          }
          if (!isSelectionPointerTarget(context.prevHoverTarget)) {
            return true;
          }
          return context.hoverTarget.edge !== context.prevHoverTarget.edge;
        },
        didExitSelection: (context) => {
          if (!isSelectionPointerTarget(context.prevHoverTarget)) {
            return false;
          }
          if (!isSelectionPointerTarget(context.hoverTarget)) {
            return true;
          }
          return context.hoverTarget.edge !== context.prevHoverTarget.edge;
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

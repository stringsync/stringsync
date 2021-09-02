import { assign, merge } from 'lodash';
import { ContextFrom, EventFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { Duration } from '../../util/Duration';
import { AnchoredTimeSelection } from './AnchoredTimeSelection';
import { CursorWrapper, MusicDisplayEventBus } from './types';

export enum PointerTargetType {
  None,
  Cursor,
  Selection,
}

export type PointerTarget =
  | { type: PointerTargetType.None }
  | { type: PointerTargetType.Cursor; cursor: CursorWrapper }
  | { type: PointerTargetType.Selection; selection: AnchoredTimeSelection };

export type PointerContext = ContextFrom<typeof pointerModel>;

export type PointerEvent = EventFrom<typeof pointerModel>;

const LONG_HOLD_DURATION = Duration.ms(1000);
const DRAGGABLE_TARGET_TYPES: PointerTargetType[] = [PointerTargetType.Cursor];

const initialContext: { target: PointerTarget } = { target: { type: PointerTargetType.None } };

export const pointerModel = createModel(initialContext, {
  events: {
    up: () => ({}),
    down: () => ({}),
    move: () => ({}),
  },
});

export const createPointerMachine = (eventBus: MusicDisplayEventBus) => {
  return pointerModel.createMachine(
    {
      id: 'pointer',
      initial: 'off',
      strict: true,
      states: {
        up: {
          entry: 'reset',
          on: { down: { target: 'down.hold' } },
        },
        down: {
          on: { up: { target: '#pointer.up' } },
          states: {
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
            hold: {
              invoke: {
                src: 'waitForLongHold',
                onDone: { target: 'longHold' },
              },
              on: { move: [{ target: 'drag', cond: 'hasDraggableTarget' }, { target: 'select' }] },
            },
            longHold: {
              exit: [],
            },
          },
        },
      },
    },
    {
      actions: {
        reset: assign(() => merge({}, initialContext)),
        dispatchDragStarted: (context) => {
          if (context.target.type === PointerTargetType.Cursor) {
            eventBus.dispatch('cursordragstarted', { cursor: context.target.cursor });
          }
        },
        dispatchDragUpdated: (context) => {
          if (context.target.type === PointerTargetType.Cursor) {
            eventBus.dispatch('cursordragupdated', { cursor: context.target.cursor });
          }
        },
        dispatchDragEnded: (context) => {
          if (context.target.type === PointerTargetType.Cursor) {
            eventBus.dispatch('cursordragended', { cursor: context.target.cursor });
          }
        },
        dispatchSelectStarted: (context) => {
          if (context.target.type === PointerTargetType.Selection) {
            eventBus.dispatch('selectionstarted', { selection: context.target.selection });
          }
        },
        dispatchSelectUpdated: (context) => {
          if (context.target.type === PointerTargetType.Selection) {
            eventBus.dispatch('selectionupdated', { selection: context.target.selection });
          }
        },
        dispatchSelectEnded: (context) => {
          if (context.target.type === PointerTargetType.Selection) {
            eventBus.dispatch('selectionended', { selection: context.target.selection });
          }
        },
      },
      guards: {
        hasDraggableTarget: (context) => {
          return DRAGGABLE_TARGET_TYPES.includes(context.target.type);
        },
      },
      services: {
        waitForLongHold: async () => {
          await new Promise((resolve) => setTimeout(resolve, LONG_HOLD_DURATION.ms));
        },
      },
    }
  );
};

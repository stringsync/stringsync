import { EventFrom } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { createModel } from 'xstate/lib/model';
import {
  HorizontalEdgeIntersection,
  IntersectionObserverAnalysis,
  PositionalRelationship,
  SizeComparison,
} from './types';

export type AutoscrollContext = {
  analysis: IntersectionObserverAnalysis;
};
export type AutoscrollEvent = EventFrom<typeof model>;
export type PerformAutoscrollCallback = (context: AutoscrollContext) => void;

const NULL_ANALYSIS: IntersectionObserverAnalysis = {
  visibility: 0,
  sizeComparison: SizeComparison.Indeterminate,
  horizontalEdgeIntersection: HorizontalEdgeIntersection.None,
  positionalRelationship: PositionalRelationship.Indeterminate,
};

const INITIAL_AUTOSCROLL_CONTEXT: AutoscrollContext = {
  analysis: NULL_ANALYSIS,
};

export const model = createModel(INITIAL_AUTOSCROLL_CONTEXT, {
  events: {
    updateAnalysis: (analysis: IntersectionObserverAnalysis) => ({ analysis }),
    autoscroll: () => ({}),
  },
});

export const events = model.events;

export const createMachine = (performAutoscroll: PerformAutoscrollCallback) => {
  return model.createMachine(
    {
      id: 'autoscroll',
      initial: 'waiting',
      preserveActionOrder: true,
      strict: true,
      states: {
        waiting: {
          on: {
            updateAnalysis: ['assignAnalysis'],
            autoscroll: { target: 'autoscrolling', actions: ['performAutoscroll'] },
          },
        },
        autoscrolling: {
          on: {
            updateAnalysis: ['assignAnalysis'],
          },
          after: {},
        },
      },
    },
    {
      actions: {
        assignAnalysis: assign<AutoscrollContext, AutoscrollEvent>({
          analysis: (context, event) => {
            if (event.type === 'updateAnalysis') {
              return event.analysis;
            }
            return context.analysis;
          },
        }),
        performAutoscroll,
      },
    }
  );
};

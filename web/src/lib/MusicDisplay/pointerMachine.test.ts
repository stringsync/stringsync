import { MusicDisplayEventBus } from '.';
import { EventBus } from '../EventBus';
import { createPointerMachine, PointerMachine } from './pointerMachine';

describe('pointerMachine', () => {
  let eventBus: MusicDisplayEventBus;
  let pointerMachine: PointerMachine;

  beforeEach(() => {
    eventBus = new EventBus();
    pointerMachine = createPointerMachine(eventBus);
  });

  describe('initial', () => {
    it.todo('intializes in the up state');

    it.todo('initializes with the initial context');
  });

  describe('up', () => {
    it.todo('responds to move events');

    it.todo('updates hover state on move');

    it.todo('dispatches cursor entered events');

    it.todo('dispatches cursor exit events');

    it.todo('responds to down events');

    it.todo('updates down state on down');
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

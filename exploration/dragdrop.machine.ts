import {assign, createMachine, interpret} from '@xstate/fsm';

import {Collision, Point, UniqueIdentifier} from './types';

export interface DragDropMachineContext {
  active: UniqueIdentifier | null;
  over: UniqueIdentifier | null;
  collisions: Collision[] | null;
  position: {
    initial: Point;
    current: Point;
  } | null;
}

export type DragDropMachineEvent =
  | {
      type: 'START';
      id: UniqueIdentifier;
      position: Point;
    }
  | {
      type: 'MOVE';
      position: Point;
    }
  | {
      type: 'OVER';
      id: UniqueIdentifier;
    }
  | {
      type: 'END';
    };

const dragDropMachine = createMachine<
  DragDropMachineContext,
  DragDropMachineEvent
>(
  {
    id: 'dragDropMachine',
    initial: 'idle',
    context: {
      active: null,
      collisions: null,
      over: null,
      position: null,
    },
    states: {
      idle: {
        on: {
          START: {
            target: 'dragging',
            actions: ['assignActiveId', 'updatePosition'],
          },
        },
      },
      dragging: {
        on: {
          MOVE: {
            actions: ['updatePosition', 'detectCollisions'],
          },
          OVER: {
            actions: 'assignOverId',
          },
          END: {
            target: 'idle',
            actions: 'reset',
          },
        },
      },
    },
  },
  {
    actions: {
      detectCollisions: assign((context, event) => {
        if (event.type !== 'START') return context;

        return {
          ...context,
          collisions: event.id,
        };
      }),
      assignActiveId: assign((context, event) => {
        if (event.type !== 'START') return context;

        return {
          ...context,
          active: event.id,
        };
      }),
      assignOverId: assign((context, event) => {
        if (event.type !== 'OVER') return context;

        return {
          ...context,
          over: event.id,
        };
      }),
      updatePosition: assign((context, event) => {
        if ('position' in event) {
          return {
            ...context,
            position: {
              initial: event.position,
              ...context.position,
              current: event.position,
            },
          };
        }

        return context;
      }),
      reset: assign((context) => {
        return {
          ...context,
          active: null,
          over: null,
          position: null,
        };
      }),
    },
  }
);

const manager = interpret(dragDropMachine);
manager.subscribe((state) => {
  // if (state.matches("dragging")) {
  console.log(state);
  // }
});

manager.start();
manager.send({type: 'START', id: '2', position: {x: 0, y: 0}});
manager.send({type: 'MOVE', position: {x: 20, y: 20}});

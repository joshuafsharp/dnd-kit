import type {Coordinates, UniqueIdentifier} from '@dnd-kit/types';
import {batch, computed, effect, signal} from '@preact/signals-core';

import type {Draggable} from '../draggable';
import type {Droppable} from '../droppable';
import type {NodeManager} from '../nodes';

import {createPositionManager} from './position';

export enum Status {
  Idle = 'idle',
  Dragging = 'dragging',
  Dropping = 'dropped',
}

function createDragOperationState() {
  const status = signal<Status>(Status.Idle);
  const draggableId = signal<UniqueIdentifier | null>(null);
  const droppableId = signal<UniqueIdentifier | null>(null);

  return {
    status,
    draggableId,
    droppableId,
  };
}

export interface Input<
  T extends Draggable = Draggable,
  U extends Droppable = Droppable
> {
  draggable: NodeManager<T>;
  droppable: NodeManager<U>;
}

export type DragOperationManager<
  T extends Draggable = Draggable,
  U extends Droppable = Droppable
> = ReturnType<typeof createDragOperationManager<T, U>>;

export function createDragOperationManager<
  T extends Draggable = Draggable,
  U extends Droppable = Droppable
>({draggable, droppable}: Input<T, U>) {
  const {status, draggableId, droppableId} = createDragOperationState();
  const position = createPositionManager();
  const isDragging = () => status.peek() === Status.Dragging;

  return {
    draggable: {
      active: computed(() => draggable.get(draggableId.value)),
    },
    droppable: {
      over: computed(() => droppable.get(droppableId.value)),
    },
    status,
    position,
    actions: {
      start(id: UniqueIdentifier, coordinates: Coordinates) {
        if (!draggable.get(id)) {
          throw new Error(`No registered draggable found for id: ${id}`);
        }

        batch(() => {
          status.value = Status.Dragging;
          draggableId.value = id;
          position.initialize(coordinates);
        });
      },
      move(coordinates: Coordinates) {
        if (!isDragging()) {
          return;
        }

        position.update(coordinates);
      },
      over(id: UniqueIdentifier | null) {
        if (!isDragging()) {
          return;
        }

        batch(() => {
          droppableId.value = id;
        });
      },
      cancel() {
        // TO-DO
      },
      stop() {
        if (!isDragging()) {
          return;
        }

        status.value = Status.Dropping;

        setImmediate(() => {
          batch(() => {
            status.value = Status.Idle;
            draggableId.value = null;
            droppableId.value = null;
            position.clear();
          });
        });
      },
    },
  };
}

// subscribe(listener: any) {
//   // subscribe
//   listeners.add(listener);

//   return () => {
//     listeners.delete(listener);
//   };
// },

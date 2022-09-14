import type {Coordinates, UniqueIdentifier} from '@dnd-kit/types';
import {batch, computed} from '@preact/signals-core';

import type {Draggable} from '../draggable';
import type {Droppable} from '../droppable';

import {createCollisionManager} from '../collision';
import {createNodeManager} from '../nodes';
import {createDragOperationManager} from './dragOperation';

export interface DragOperation {
  type: 'start' | 'move' | 'over' | 'end';
  data: {
    draggable: {
      active: {
        id: UniqueIdentifier;
      };
    };
    droppable: {
      over: {
        id: UniqueIdentifier | null;
      };
    };
    position: {
      initial: Coordinates;
      current: Coordinates;
      delta: Coordinates;
    };
  };
}

export interface DragDropConfiguration {}

export type CreateDragDropManagerInput = Partial<DragDropConfiguration>;

export function createDragDropManager<
  T extends Draggable = Draggable,
  U extends Droppable = Droppable
>(_config?: CreateDragDropManagerInput) {
  const draggable = createNodeManager<T>();
  const droppable = createNodeManager<U>();
  const dragOperation = createDragOperationManager<T, U>({
    draggable,
    droppable,
  });

  const collisions = createCollisionManager({
    active: dragOperation.draggable.active,
    over: dragOperation.droppable.over,
    delta: dragOperation.position.delta,
    coordinates: dragOperation.position.current,
    nodes: droppable.nodes,
  });

  return {
    collisions,
    draggable,
    droppable,
    dragOperation,
  };
}

export type DragDropManager<
  T extends Draggable = Draggable,
  U extends Droppable = Droppable
> = ReturnType<typeof createDragDropManager<T, U>>;

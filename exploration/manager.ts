import {proxy, snapshot, ref} from 'valtio';
import {derive, proxyMap} from 'valtio/utils';

import type {Position, Point} from '../types/geometry';
import {delta} from '../utilities/math';

import {UniqueIdentifier, Draggable, Droppable} from './types';

interface DragDropConfiguration {
  collisionDetection: any;
}

interface DroppableState {
  over: UniqueIdentifier | null;
}

interface DragOperationState {
  active: UniqueIdentifier | null;
  position: Position | null;
  delta: Point | null;
}

export function createDragDropManager<T>(
  config?: Partial<DragDropConfiguration>
) {
  const listeners = new Set();
  const draggableNodes = proxyMap<UniqueIdentifier, Draggable<T>>();
  const droppableNodes = proxyMap<UniqueIdentifier, Droppable<T>>();
  const configuration = proxy<DragDropConfiguration>({
    collisionDetection: null,
    ...config,
  });
  const dragOperationState = proxy<DragOperationState>({
    active: null,
    position: null,
  } as DragOperationState);

  derive(
    {
      delta: (get) => delta(get(dragOperationState).position),
    },
    {
      sync: true,
      proxy: dragOperationState,
    }
  );

  const droppableState = proxy<DroppableState>({
    over: null,
  });

  derive(
    {
      collisions: (get) =>
        computeCollisions(
          get(configuration).collisionDetection,
          get(droppableNodes),
          get(dragOperationState)
        ),
    },
    {
      proxy: droppableState,
    }
  );

  return {
    getSnapshot() {
      return {
        dragOperation: snapshot(dragOperationState),
        draggableNodes: Array.from(snapshot(draggableNodes).values()),
        droppable: snapshot(droppableState),
      };
    },
    configuration: {
      update(input: Partial<DragDropConfiguration>) {
        for (const [key, value] of Object.entries(input)) {
          configuration[key as keyof DragDropConfiguration] = value;
        }
      },
    },
    dragOperation: {
      start(event: {id: UniqueIdentifier; position: Point}) {
        if (!draggableNodes.has(event.id)) {
          return;
        }

        dragOperationState.active = event.id;
        dragOperationState.position = {
          initial: event.position,
          current: event.position,
        };
      },
      move(event: {position: Point}) {
        if (!dragOperationState.position) {
          return;
        }

        dragOperationState.position.current = event.position;
      },
      end() {
        droppableState.over = null;
        dragOperationState.active = null;
        dragOperationState.position = null;
      },
    },
    draggable: {
      register(node: Draggable<T>) {
        draggableNodes.set(node.id, node);
      },
      unregister(id: UniqueIdentifier) {
        draggableNodes.delete(id);
      },
    },
    droppable: {
      register(node: Droppable<T>) {
        droppableNodes.set(node.id, node);
      },
      unregister(id: UniqueIdentifier) {
        droppableNodes.delete(id);
      },
      setOver(id: UniqueIdentifier | null) {
        droppableState.over = id;
      },
    },
  };
}

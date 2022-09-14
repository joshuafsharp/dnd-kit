import {proxy, snapshot, ref} from 'valtio';
import {derive, proxyMap} from 'valtio/utils';
import {rectIntersection, CollisionDetection} from '@dnd-kit/core';

import {delta} from './utilities';
import {Position, Point, UniqueIdentifier, Draggable, Droppable} from './types';

interface DragDropConfiguration {
  collisionDetection: CollisionDetection;
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
    collisionDetection: rectIntersection,
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

const manager = createDragDropManager<Element>();

function createDraggable<T>(node: Draggable<T>) {
  const draggable = proxy({
    id: 'test',
    type: 'button',
    data: {},
    disabled: false,
    measure: (node: Draggable<T>) => node.ref.getBoundingClientRect(),
    ref: ref(document.createElement('button')),
  });

  return {};
}

const draggable = createDraggable({});

manager.draggable.register(draggable);

draggable.disabled = true;

manager.dragOperation.start({
  id: 'test',
  position: {
    x: 20,
    y: 5,
  },
});

manager.dragOperation.move({
  position: {
    x: 30,
    y: 10,
  },
});

manager.droppable.setOver('testing');

console.log(manager.getSnapshot());

manager.dragOperation.end();
console.log(manager.getSnapshot());

function computeCollisions(
  collisionDetection: CollisionDetection,
  droppableNodes: Map<UniqueIdentifier, Droppable<any>>,
  dragOperation: DragOperationState
) {
  if (!dragOperation.active || !dragOperation.position) {
    return null;
  }

  return collisionDetection({
    active: {
      id: dragOperation.active,
    } as any,
    collisionRect: {
      left: 100,
      right: 200,
      top: 100,
      bottom: 200,
      width: 100,
      height: 100,
    },
    pointerCoordinates: dragOperation.position.current,
    droppableContainers: Array.from(droppableNodes.values()) as any,
    droppableRects: new Map(),
  });
}

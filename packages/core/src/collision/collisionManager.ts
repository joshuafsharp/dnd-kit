import {lazyComputed, snapshot} from '@dnd-kit/utilities';
import type {Snapshot} from '@dnd-kit/utilities';
import type {Coordinates, DeepSignal} from '@dnd-kit/types';

import type {NodeMap} from '../nodes';

import type {Draggable} from '../draggable';
import type {Droppable} from '../droppable';

export type Input<
  T extends Draggable = Draggable,
  U extends Droppable = Droppable
> = DeepSignal<{
  active: T | undefined;
  over: U | undefined;
  delta: Coordinates | null;
  coordinates: Coordinates | null;
  nodes: NodeMap<U>;
}>;

export function createCollisionManager<
  T extends Draggable = Draggable,
  U extends Droppable = Droppable
>({active, over, delta, coordinates, nodes}: Input<T, U>) {
  return lazyComputed(() => {
    const translate = delta.value;
    const activeDraggable = active.value;
    const activeRect = activeDraggable?.rect.value;

    if (!translate || !activeDraggable || !activeRect) {
      return null;
    }

    const collisionRect = activeRect;

    // {
    //   width: activeRect.width,
    //   height: activeRect.height,
    //   left: activeRect.left + translate.x,
    //   right: activeRect.right + translate.x,
    //   top: activeRect.top + translate.y,
    //   bottom: activeRect.bottom + translate.y,
    // };

    const type = activeDraggable.type.value;
    const collisionDetection = activeDraggable.collisionDetection.value;
    const droppableNodes: Snapshot<U>[] = [];

    for (const [, node] of nodes.value) {
      const rect = node.rect.value;
      const isDisabled = node.disabled.value === true;

      if (!rect || isDisabled) {
        continue;
      }

      const accepts = node.accepts?.value;

      if (accepts && type != null && !accepts.includes(type)) {
        continue;
      }

      droppableNodes.push(snapshot(node));
    }

    return collisionDetection<T, U>({
      pointerCoordinates: coordinates.peek(),
      collisionRect,
      droppable: {
        nodes: droppableNodes,
      },
      dragOperation: {
        active: snapshot(activeDraggable),
        over: over.value ? snapshot(over.value) : null,
      },
    });
  });
}

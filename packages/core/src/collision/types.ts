import type {
  BoundingRectangle,
  Coordinates,
  UniqueIdentifier,
} from '@dnd-kit/types';
import type {Snapshot} from '@dnd-kit/utilities';

import type {Draggable} from '../draggable';
import type {Droppable} from '../droppable';

export interface Collision {
  id: UniqueIdentifier;
  value: number;
}

export interface CollisionDetectionInput<
  T extends Draggable = Draggable,
  U extends Droppable = Droppable
> {
  pointerCoordinates: Coordinates | null;
  collisionRect: BoundingRectangle;
  droppable: {
    nodes: Snapshot<U>[];
  };
  dragOperation: {
    active: Snapshot<T>;
    over: Snapshot<U> | null;
  };
}

export type CollisionDetection = <
  T extends Draggable = Draggable,
  U extends Droppable = Droppable
>(
  input: CollisionDetectionInput<T, U>
) => Collision[];

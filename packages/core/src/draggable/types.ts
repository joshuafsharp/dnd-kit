import type {DeepSignal, Type} from '@dnd-kit/types';

import type {Data, NodeSnapshot} from '../nodes';

import type {CollisionDetection} from '../collision';

export interface DraggableSnapshot<T extends Data = Data>
  extends NodeSnapshot<T> {
  type: Type | undefined;
  collisionDetection: CollisionDetection;
}

export type Draggable<T extends Data = Data> = DeepSignal<DraggableSnapshot<T>>;

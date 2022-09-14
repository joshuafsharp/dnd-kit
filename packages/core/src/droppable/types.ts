import type {DeepSignal, Type} from '@dnd-kit/types';

import type {Data, NodeSnapshot} from '../nodes';

export interface DroppableSnapshot<T extends Data = Data>
  extends NodeSnapshot<T> {
  accepts?: Type[];
}

export type Droppable<T extends Data = Data> = DeepSignal<DroppableSnapshot<T>>;

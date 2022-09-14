import type {Type} from '@dnd-kit/types';
import {signal} from '@preact/signals-core';

import {createNode} from '../nodes';
import type {CreateNodeInput, Data} from '../nodes';

import type {Droppable} from './types';

export interface Input<T extends Data = Data> extends CreateNodeInput<T> {
  accepts?: Type[];
}

export function createDroppable<T extends Data = Data>({
  accepts: initialAccepts,
  ...input
}: Input<T>): Droppable<T> {
  const node = createNode<T>(input);
  const accepts = signal(initialAccepts);

  return {
    ...node,
    accepts,
  };
}

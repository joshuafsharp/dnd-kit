import type {Type} from '@dnd-kit/types';
import {signal} from '@preact/signals-core';

import {createNode} from '../nodes';
import type {CreateNodeInput, Data} from '../nodes';
import {CollisionDetection, rectIntersection} from '../collision';

import type {Draggable} from './types';

export interface Input<T extends Data = Data> extends CreateNodeInput<T> {
  type?: Type;
  collisionDetection?: CollisionDetection;
}

export function createDraggable<T extends Data = Data>({
  type: initialType,
  collisionDetection: initialCollisionDetection = rectIntersection,
  ...input
}: Input<T>): Draggable<T> {
  const node = createNode<T>(input);
  const type = signal(initialType);
  const collisionDetection = signal(initialCollisionDetection);

  return {
    ...node,
    type,
    collisionDetection,
  };
}

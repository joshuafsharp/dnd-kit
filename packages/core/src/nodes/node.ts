import type {BoundingRectangle, UniqueIdentifier} from '@dnd-kit/types';
import {signal} from '@preact/signals-core';

import type {Data, Node} from './types';

export interface Input<T extends Data = Data> {
  id: UniqueIdentifier;
  data?: T | null;
  disabled?: boolean;
}

export function createNode<T extends Data = Data>({
  id: initialId,
  disabled: initialDisabled = false,
  data: initialData = null,
}: Input<T>): Node<T> {
  const id = signal(initialId);
  const data = signal(initialData);
  const disabled = signal(initialDisabled);
  const rect = signal<BoundingRectangle | null>(null);

  return {
    id,
    data,
    disabled,
    rect,
  };
}

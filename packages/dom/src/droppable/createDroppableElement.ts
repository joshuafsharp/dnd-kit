import {createDroppable, CreateDroppableInput} from '@dnd-kit/core';
import type {Data, Droppable} from '@dnd-kit/core';
import {computed, effect, signal} from '@preact/signals-core';

import type {DroppableElement} from './types';

export interface Input<T extends Data = Data> extends CreateDroppableInput<T> {}

export function createDroppableElement<T extends Data = Data>(
  input: Input<T>
): DroppableElement<T> {
  const droppable = createDroppable<T>(input);
  const {disabled} = droppable;
  const ref = signal<Element | null>(null);
  const rect = computed(() => {
    const element = ref.value;
    const isDisabled = disabled.value === true;

    if (!element || isDisabled) {
      return null;
    }

    return element.getBoundingClientRect();
  });

  return {
    ...droppable,
    rect,
    ref,
  };
}

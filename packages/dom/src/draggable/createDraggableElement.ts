import {createDraggable, CreateDraggableInput} from '@dnd-kit/core';
import type {Data} from '@dnd-kit/core';
import {computed, signal} from '@preact/signals-core';

import type {DraggableElement} from './types';

export interface Input<T extends Data = Data> extends CreateDraggableInput<T> {}

export function createDraggableElement<T extends Data = Data>(
  input: Input<T>
): DraggableElement<T> {
  const draggable = createDraggable<T>(input);
  const sourceRef = signal<Element | null>(null);
  const activatorRef = signal<Element | null>(null);
  const rect = computed(() => {
    const element = sourceRef.value;

    if (!element) {
      return null;
    }

    return element.getBoundingClientRect();
  });

  return {
    ...draggable,
    ref: {
      activator: activatorRef,
      source: sourceRef,
    },
    rect,
  };
}

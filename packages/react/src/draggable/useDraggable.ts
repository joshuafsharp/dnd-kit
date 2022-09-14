import {useEffect, useState} from 'react';
import {useComputed} from '@preact/signals-react';
import type {Data} from '@dnd-kit/core';
import {createDraggableElement} from '@dnd-kit/dom';
import type {CreateDraggableElementInput} from '@dnd-kit/dom';

import {useDndContext} from '../context';

export function useDraggable<T extends Data = Data>(
  input: CreateDraggableElementInput<T>
) {
  const manager = useDndContext();
  const [draggable] = useState(() => createDraggableElement(input));
  const {position} = manager.dragOperation;
  const {active} = manager.dragOperation.draggable;
  const {transform, isActive} = useComputed(() => {
    const isActive = active.value === draggable;

    return {
      isActive,
      transform: isActive
        ? {
            ...position.delta.value,
            scaleX: 1,
            scaleY: 1,
          }
        : null,
    };
  }).value;

  useEffect(() => {
    manager.draggable.register(draggable);

    return () => {
      manager.draggable.unregister(draggable);
    };
  }, [draggable]);

  return {
    isActive,
    disabled: draggable.disabled.value,
    transform,
    ref: (element: Element | null) => {
      draggable.ref.source.value = element;
    },
    activatorRef: (element: Element | null) => {
      draggable.ref.activator.value = element;
    },
  };
}

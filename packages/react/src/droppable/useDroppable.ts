import {useEffect, useState} from 'react';
import {useComputed} from '@preact/signals-react';
import type {Data} from '@dnd-kit/core';
import {createDroppableElement} from '@dnd-kit/dom';
import type {CreateDroppableElementInput} from '@dnd-kit/dom';

import {useDndContext} from '../context';

export function useDroppable<T extends Data = Data>(
  input: CreateDroppableElementInput<T>
) {
  const manager = useDndContext();
  const [droppable] = useState(() => createDroppableElement(input));
  const {over} = manager.dragOperation.droppable;
  const isOver = useComputed(() => over.value === droppable).value;

  useEffect(() => {
    manager.droppable.register(droppable);

    return () => {
      manager.droppable.unregister(droppable);
    };
  }, [droppable]);

  return {
    disabled: droppable.disabled.value,
    isOver,
    ref: (element: Element | null) => {
      droppable.ref.value = element;
    },
  };
}

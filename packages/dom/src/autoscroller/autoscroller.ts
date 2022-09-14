import type {DragDropManager} from '@dnd-kit/core';
import {effect} from '@preact/signals-core';
import {debouncedComputed} from '@dnd-kit/utilities';
import {getScrollableAncestors} from '@dnd-kit/dom-utilities';

import type {DraggableElement} from '../draggable';
import type {DroppableElement} from '../droppable';

interface Input {
  manager: DragDropManager<DraggableElement, DroppableElement>;
}

export function createAutoScroller({manager}: Input) {
  const {position} = manager.dragOperation;
  const scrollableElements = debouncedComputed(() => {
    const currentPosition = position.current.value;

    if (!currentPosition) {
      return null;
    }

    const {x, y} = currentPosition;
    const element = document.elementFromPoint(x, y);
    const scrollableElements = getScrollableAncestors(element);

    return scrollableElements;
  }, 500);

  effect(() => {
    console.log(scrollableElements.value);
  });
}

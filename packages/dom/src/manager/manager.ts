import {
  createDragDropManager as coreCreateDragDropManager,
  CreateDragDropManagerInput,
} from '@dnd-kit/core';

import {createAutoScroller} from '../autoscroller';
import type {DraggableElement} from '../draggable';
import type {DroppableElement} from '../droppable';

export interface Input extends CreateDragDropManagerInput {}

export function createDragDropManager(input?: Input) {
  const manager = coreCreateDragDropManager<DraggableElement, DroppableElement>(
    input
  );

  createAutoScroller({manager});

  return manager;
}

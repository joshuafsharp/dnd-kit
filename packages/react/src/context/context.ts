import {createContext} from 'react';
import {createDragDropManager, DragDropManager} from '@dnd-kit/core';
import type {DraggableElement, DroppableElement} from '@dnd-kit/dom';

export const DragDropContext = createContext<
  DragDropManager<DraggableElement, DroppableElement>
>(createDragDropManager());

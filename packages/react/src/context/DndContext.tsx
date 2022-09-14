import {PropsWithChildren, useEffect, useState} from 'react';
import {createDragDropManager, PointerSensor} from '@dnd-kit/dom';

import {DragDropContext} from './context';
import {useComputed} from '@preact/signals-react';

export interface Props {}

export function DndContext({children}: PropsWithChildren<Props>) {
  const [manager] = useState(() => createDragDropManager());

  useEffect(() => {
    const sensor = new PointerSensor(manager);
  }, [manager]);

  const over = useComputed(() => {
    const collisions = manager.collisions.value;

    return collisions && collisions.length > 0 ? collisions[0].id : null;
  }).value;

  useEffect(() => {
    manager.dragOperation.actions.over(over);
  }, [over]);

  return (
    <DragDropContext.Provider value={manager}>
      {children}
    </DragDropContext.Provider>
  );
}

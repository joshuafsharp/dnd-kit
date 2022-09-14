import React from 'react';
import {UniqueIdentifier} from '@dnd-kit/types';
import {DndContext, useDraggable, useDroppable} from '@dnd-kit/react';
import '@dnd-kit/core';

const items = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

export function App() {
  return (
    <DndContext>
      <Draggable id="test" />
      {items.map((id) => (
        <Droppable key={id} id={id} />
      ))}
    </DndContext>
  );
}

interface DraggableProps {
  id: UniqueIdentifier;
}

function Draggable({id}: DroppableProps) {
  const {ref, transform} = useDraggable({id});

  return (
    <button
      ref={ref}
      style={{
        transition: transform ? undefined : 'transform 250ms ease',
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      Drag me
    </button>
  );
}

interface DroppableProps {
  id: UniqueIdentifier;
}

function Droppable({id}: DroppableProps) {
  const {ref, isOver} = useDroppable({id});

  return (
    <div
      ref={ref}
      style={{
        width: 300,
        height: 300,
        border: '1px solid #DEDEDE',
        borderRadius: 10,
        margin: 10,
        backgroundColor: isOver ? 'green' : undefined,
      }}
    >
      Container: {id}
    </div>
  );
}

import {DragDropManager} from '@dnd-kit/core';
import {DraggableElement} from '../../draggable';
import {DroppableElement} from '../../droppable';

function createPointerSensor() {
  return {
    activators: [
      {
        eventName: 'onPointerDown' as const,
        handler: (event: PointerEvent) => {
          if (!event.isPrimary || event.button !== 0) {
            return false;
          }

          return true;
        },
      },
    ],
  };
}

export class PointerSensor {
  constructor(
    private manager: DragDropManager<DraggableElement, DroppableElement>
  ) {
    this.manager = manager;

    document.addEventListener('pointerdown', this.handlePointerDown, {
      capture: true,
    });
  }

  handlePointerDown = (event: PointerEvent) => {
    if (!event.isPrimary || event.button !== 0) {
      return;
    }

    if (!(event.target instanceof Element)) {
      return;
    }

    const draggableNodes = this.manager.draggable.nodes.peek();

    for (const node of draggableNodes.values()) {
      const element = node.ref.activator.peek() ?? node.ref.source.peek();

      if (
        element &&
        (element === event.target || element.contains(event.target))
      ) {
        this.manager.dragOperation.actions.start(node.id.peek(), {
          x: event.clientX,
          y: event.clientY,
        });

        event.preventDefault();

        document.addEventListener('pointermove', this.handlePointerMove);
        document.addEventListener('pointerup', this.handlePointerUp);
        break;
      }
    }
  };

  handlePointerMove = (event: PointerEvent) => {
    this.manager.dragOperation.actions.move({
      x: event.clientX,
      y: event.clientY,
    });
  };

  handlePointerUp = () => {
    this.manager.dragOperation.actions.stop();

    document.removeEventListener('pointermove', this.handlePointerMove);
    document.removeEventListener('pointerup', this.handlePointerUp);
  };
}

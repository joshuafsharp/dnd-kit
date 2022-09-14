export {createDragDropManager} from './manager';
export type {
  CreateDragDropManagerInput,
  DragDropConfiguration,
  DragDropManager,
  DragOperationManager,
  DragOperationStatus,
} from './manager';

export type {Data, NodeManager} from './nodes';

export {createDraggable} from './draggable';
export type {
  CreateDraggableInput,
  Draggable,
  DraggableSnapshot,
} from './draggable';

export {createDroppable} from './droppable';
export type {
  CreateDroppableInput,
  Droppable,
  DroppableSnapshot,
} from './droppable';

export {rectIntersection} from './collision';

export type {Collision, CollisionDetection} from './collision';

// const manager = createDragDropManager();

// effect(() => {
//   console.log(manager.collisions.value);
// });

// const droppable = createDroppable<Element>({
//   id: 'test',
// });

// manager.droppable.register(droppable);

// const element = document.createElement('div');
// element.style.width = '100px';
// element.style.height = '200px';
// element.style.top = '20px';
// element.style.left = '10px';
// element.style.position = 'absolute';

// document.body.appendChild(element);

// // droppable.ref.value = element;

// manager.dragOperation.actions.start('testing', {x: 0, y: 0});
// manager.dragOperation.actions.move({x: 100, y: 30});

// requestAnimationFrame(() => {
//   element.style.width = '10px';

//   requestAnimationFrame(() => {
//     element.style.width = '200px';
//   });
// });

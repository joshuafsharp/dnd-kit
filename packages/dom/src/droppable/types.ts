import type {Data, Droppable} from '@dnd-kit/core';
import {BoundingRectangle} from '@dnd-kit/types';
import type {ReadonlySignal, Signal} from '@preact/signals-core';

export interface DroppableElement<T extends Data = Data> extends Droppable<T> {
  ref: Signal<Element | null>;
  rect: ReadonlySignal<BoundingRectangle | null>;
}

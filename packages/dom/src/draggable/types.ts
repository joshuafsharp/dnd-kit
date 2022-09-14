import type {Data, Draggable} from '@dnd-kit/core';
import type {Signal} from '@preact/signals-core';

export interface DraggableElement<T extends Data = Data> extends Draggable<T> {
  ref: {
    source: Signal<Element | null>;
    activator: Signal<Element | null>;
  };
}

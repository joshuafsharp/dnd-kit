import type {
  BoundingRectangle,
  DeepSignal,
  UniqueIdentifier,
} from '@dnd-kit/types';

export type Data = Record<string, any>;

export interface NodeSnapshot<T extends Data = Data> {
  id: UniqueIdentifier;
  data: T | null;
  disabled: boolean;
  rect: BoundingRectangle | null;
}

export type Node<T extends Data = Data> = DeepSignal<NodeSnapshot<T>>;

export type NodeMap<T extends Node<any>> = Map<T['id']['value'], T>;

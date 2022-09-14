import type {UniqueIdentifier} from '@dnd-kit/types';
import {signal} from '@preact/signals-core';
import type {Signal} from '@preact/signals-core';

import type {Node, NodeMap} from './types';

export interface NodeManager<T extends Node<any>> {
  nodes: Signal<NodeMap<T>>;
  get(id: UniqueIdentifier | null): T | undefined;
  register(node: T): void;
  unregister(node: T): void;
}

export function createNodeManager<T extends Node<any>>(): NodeManager<T> {
  const nodes = signal<NodeMap<T>>(new Map());

  return {
    nodes,
    get(id) {
      if (id == null) {
        return undefined;
      }

      return nodes.value.get(id);
    },
    register(node) {
      const updatedNodes = new Map(nodes.peek());
      updatedNodes.set(node.id.peek(), node);

      nodes.value = updatedNodes;
    },
    unregister(node) {
      const updatedNodes = new Map(nodes.peek());
      updatedNodes.delete(node.id.peek());

      nodes.value = updatedNodes;
    },
  };
}

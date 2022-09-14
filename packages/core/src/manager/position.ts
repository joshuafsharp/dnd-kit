import {delta} from '@dnd-kit/utilities';
import type {Coordinates} from '@dnd-kit/types';
import {batch, computed, signal} from '@preact/signals-core';

export interface Position {
  initial: Coordinates;
  current: Coordinates;
  delta: Coordinates;
}

function createPositionState() {
  // const pointer = signal<Coordinates | null>(null);
  const current = signal<Coordinates | null>(null);
  const initial = signal<Coordinates | null>(null);

  return {
    current,
    initial,
    delta: computed(() => delta(current.value, initial.value)),
  };
}

export function createPositionManager() {
  const {current, initial, delta} = createPositionState();

  return {
    current,
    initial,
    delta,
    initialize(coordinates: Coordinates) {
      if (initial.value || current.value) {
        return;
      }

      batch(() => {
        initial.value = coordinates;
        current.value = coordinates;
      });
    },
    update(coordinates: Coordinates) {
      if (!initial.value) {
        return;
      }

      if (
        current.value?.x === coordinates.x &&
        current.value?.y === coordinates.y
      ) {
        return;
      }

      current.value = coordinates;
    },
    clear() {
      batch(() => {
        initial.value = null;
        current.value = null;
      });
    },
  };
}

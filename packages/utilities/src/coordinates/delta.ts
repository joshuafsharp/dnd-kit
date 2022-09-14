import type {Coordinates} from '@dnd-kit/types';

import {subtract} from '../math';

export function delta(a: Coordinates | null, b: Coordinates | null) {
  if (!a || !b) {
    return null;
  }

  return subtract({...a}, b);
}

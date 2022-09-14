import {computed} from '@preact/signals-core';

import {isEqual} from '../other';

export function lazyComputed<T>(callback: () => T, comparator = isEqual) {
  let previousValue: T | undefined;

  return computed(() => {
    const value = callback();

    if (value && previousValue && comparator(previousValue, value)) {
      return previousValue;
    }

    previousValue = value;
    return value;
  });
}

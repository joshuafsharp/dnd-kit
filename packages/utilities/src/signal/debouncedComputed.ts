import {batch, effect, signal} from '@preact/signals-core';
import type {Signal} from '@preact/signals-core';

import {debounce} from '../other';

export function debouncedComputed<T extends () => any>(
  callback: T,
  timeout: number
): Signal<ReturnType<T>> {
  const computed = signal<ReturnType<T>>(undefined as any);

  effect(
    debounce(
      () => {
        computed.value = batch(callback);
      },
      timeout,
      {leading: true}
    )
  );

  return computed;
}

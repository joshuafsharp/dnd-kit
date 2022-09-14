import type {Signal} from '@preact/signals-core';

export type ValueFromSignal<T> = T extends Signal
  ? ReturnType<T['peek']>
  : never;

export type Snapshot<T extends {[key: string]: Signal<any>}> = {
  [Key in keyof T]: ValueFromSignal<T[Key]>;
};

export function snapshot<
  T extends Record<string, Signal<any>>,
  U = Snapshot<T>
>(signal: T): U {
  return Object.entries(signal).reduce<U>((acc, [key, value]) => {
    try {
      acc[key as keyof U] = value.peek();
    } catch {}

    return acc;
  }, {} as U);
}

import type {Signal} from '@preact/signals-core';

export type Resolve<T> = T | Promise<T>;

export type DeepSignal<T> = {
  [P in keyof T]: Signal<T[P]>;
};

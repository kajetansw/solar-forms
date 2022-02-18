import type { Signal } from 'solid-js';
import type { FormGroupValue } from './types';
import { createSignal } from 'solid-js';

export function createFormGroup<T extends FormGroupValue>(initialValue: T): Signal<T> {
  const signal = createSignal(initialValue);
  return signal;
}

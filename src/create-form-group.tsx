import { createSignal } from 'solid-js';
import type { FormGroupSignal, FormGroupValue } from './types';

export function createFormGroup<T extends FormGroupValue>(initialValue: T): FormGroupSignal<T> {
  const [value, setValue] = createSignal(initialValue) as FormGroupSignal<T>;
  return [value, setValue];
}

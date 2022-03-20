import { createSignal } from 'solid-js';
import type { CreateFormGroupInput, ToFormGroupValue } from './types';
import { toFormGroupDisabled, toFormGroupValue } from './utils/form-control';
import { FormGroup } from './types';

export function createFormGroup<I extends CreateFormGroupInput, V extends ToFormGroupValue<I>>(
  initialValue: I
): FormGroup<I> {
  const [value, setValue] = createSignal(toFormGroupValue(initialValue)) as FormGroup<I>['value'];
  const [disabled, setDisabled] = createSignal(toFormGroupDisabled(initialValue)) as FormGroup<I>['disabled'];

  return {
    value: [value, setValue],
    disabled: [disabled, setDisabled],
  };
}

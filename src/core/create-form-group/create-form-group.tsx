import { createSignal } from 'solid-js';
import { toFormGroupValue } from './to-form-control-value';
import { toFormGroupDisabled } from './to-form-control-disabled';
import { CreateFormGroupInput } from './types';
import { FormGroup } from '../form-group-directive';

export function createFormGroup<I extends CreateFormGroupInput>(initialValue: I): FormGroup<I> {
  const [value, setValue] = createSignal(toFormGroupValue(initialValue)) as FormGroup<I>['value'];
  const [disabled, setDisabled] = createSignal(toFormGroupDisabled(initialValue)) as FormGroup<I>['disabled'];

  return {
    value: [value, setValue],
    disabled: [disabled, setDisabled],
  };
}

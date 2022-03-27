import { createSignal } from 'solid-js';
import { toFormGroupValue } from './to-form-control-value';
import { ToFormGroupDisabled, toFormGroupDisabled } from './to-form-control-disabled';
import { CreateFormGroupInput } from './types';
import { FormGroup } from '../form-group-directive';
import { everyKey, setEveryKey } from './every-key';

export function createFormGroup<I extends CreateFormGroupInput>(initialValue: I): FormGroup<I> {
  const [value, setValue] = createSignal(toFormGroupValue(initialValue)) as FormGroup<I>['value'];
  const [disabled, setDisabled] = createSignal(toFormGroupDisabled(initialValue)) as FormGroup<I>['disabled'];
  const disabledAll = () => everyKey(true)(disabled());
  const setDisabledAll = (value: boolean | ((prev: boolean) => boolean)) =>
    typeof value === 'boolean'
      ? setDisabled(setEveryKey(value)(disabled()) as ToFormGroupDisabled<I>)
      : setDisabled(setEveryKey(value(disabledAll()))(disabled()) as ToFormGroupDisabled<I>);

  return {
    value: [value, setValue],
    disabled: [disabled, setDisabled],
    disabledAll: [disabledAll, setDisabledAll],
  };
}

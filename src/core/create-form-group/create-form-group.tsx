import { createSignal } from 'solid-js';
import { toFormGroupBooleanMap, toFormGroupDisabled, toFormGroupValue } from './map-form-group-input';
import { CreateFormGroupInput } from './types';
import { FormGroup } from '../form-group-directive';
import { everyKey, setEveryKey } from './every-key';
import { ToFormGroupBooleanMap } from '../types';

export function createFormGroup<I extends CreateFormGroupInput>(initialValue: I): FormGroup<I> {
  const [value, setValue] = createSignal(toFormGroupValue(initialValue)) as FormGroup<I>['value'];
  const [disabled, setDisabled] = createSignal(toFormGroupDisabled(initialValue)) as FormGroup<I>['disabled'];
  const disabledAll = () => everyKey(true)(disabled());
  const setDisabledAll = (value: boolean | ((prev: boolean) => boolean)) =>
    typeof value === 'boolean'
      ? setDisabled(setEveryKey(value)(disabled()) as ToFormGroupBooleanMap<I>)
      : setDisabled(setEveryKey(value(disabledAll()))(disabled()) as ToFormGroupBooleanMap<I>);
  const [dirty, setDirty] = createSignal(toFormGroupBooleanMap(initialValue)) as FormGroup<I>['dirty'];

  return {
    value: [value, setValue],
    disabled: [disabled, setDisabled],
    disabledAll: [disabledAll, setDisabledAll],
    dirty: [dirty, setDirty],
  };
}

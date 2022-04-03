import { createEffect, createSignal } from 'solid-js';
import {
  toFormGroupBooleanMap,
  toFormGroupDisabled,
  toFormGroupValidatorsMap,
  toFormGroupValue,
} from './map-form-group-input';
import { CreateFormGroupInput } from './types';
import { FormGroup } from '../form-group-directive';
import { everyKey, setEveryKey } from './every-key';
import { ToFormGroupBooleanMap } from '../types';
import { FormGroupSignal } from '../../types';
import { toValid } from './map-validators';

export function createFormGroup<I extends CreateFormGroupInput>(initialValue: I): FormGroup<I> {
  const [value, setValue] = createSignal(toFormGroupValue(initialValue)) as FormGroup<I>['value'];

  const [disabled, setDisabled] = createSignal(toFormGroupDisabled(initialValue)) as FormGroup<I>['disabled'];
  const disabledAll = () => everyKey(true)(disabled());
  const setDisabledAll = (value: boolean | ((prev: boolean) => boolean)) =>
    typeof value === 'boolean'
      ? setDisabled(setEveryKey(value)(disabled()) as ToFormGroupBooleanMap<I>)
      : setDisabled(setEveryKey(value(disabledAll()))(disabled()) as ToFormGroupBooleanMap<I>);

  const [dirty, setDirty] = createSignal(toFormGroupBooleanMap(initialValue)) as FormGroup<I>['dirty'];
  const dirtyAll = () => everyKey(true)(dirty());
  const setDirtyAll = (value: boolean | ((prev: boolean) => boolean)) =>
    typeof value === 'boolean'
      ? setDirty(setEveryKey(value)(dirty()) as ToFormGroupBooleanMap<I>)
      : setDirty(setEveryKey(value(dirtyAll()))(dirty()) as ToFormGroupBooleanMap<I>);

  const [touched, setTouched] = createSignal(toFormGroupBooleanMap(initialValue)) as FormGroup<I>['touched'];
  const touchedAll = () => everyKey(true)(touched());
  const setTouchedAll = (value: boolean | ((prev: boolean) => boolean)) =>
    typeof value === 'boolean'
      ? setTouched(setEveryKey(value)(touched()) as ToFormGroupBooleanMap<I>)
      : setTouched(setEveryKey(value(touchedAll()))(touched()) as ToFormGroupBooleanMap<I>);

  const [validators, setValidators] = createSignal(
    toFormGroupValidatorsMap(initialValue)
  ) as FormGroup<I>['validators'];

  const [valid, setValid] = createSignal(toFormGroupBooleanMap(initialValue)) as FormGroupSignal<
    ToFormGroupBooleanMap<I>
  >;

  createEffect(() => {
    setValid(toValid(validators, value, disabled, dirty, touched));
  });

  return {
    value: [value, setValue],
    disabled: [disabled, setDisabled],
    disabledAll: [disabledAll, setDisabledAll],
    dirty: [dirty, setDirty],
    dirtyAll: [dirtyAll, setDirtyAll],
    touched: [touched, setTouched],
    touchedAll: [touchedAll, setTouchedAll],
    validators: [validators, setValidators],
    valid: valid,
  };
}

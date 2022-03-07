import type { FormGroupSignal, FormGroupValue } from './types';
import { createRenderEffect, onCleanup } from 'solid-js';
import isArrayElement from './utils/guards/is-array-element';
import getFormControlName from './utils/get-form-control-name';
import { FormControlInvalidKeyError, FormControlInvalidTypeError } from './utils/errors';
import { getInputValueType } from './utils/input-element.utils';
import { isBoolean, isDate, isNull, isNumber, isString } from './utils/guards';
import { getFormControl } from './utils/get-form-control';
import getFormGroupName from './utils/get-form-group-name';

export function formGroup<T extends FormGroupValue>(el: Element, formGroupSignal: () => FormGroupSignal<T>) {
  if (el && isArrayElement(el.children)) {
    const [getFormGroup, setFormGroup] = formGroupSignal();
    const formGroupKeys = Object.keys(getFormGroup());

    for (const $child of el.children) {
      const formGroupName = getFormGroupName($child);
      if (formGroupName) {
        formGroup($child, () => {
          const [getter, setter] = formGroupSignal();
          const formGroupSliceGetter = () => getter()[formGroupName] as FormGroupValue;
          return [
            formGroupSliceGetter,
            (functionOrValue) =>
              setter(
                typeof functionOrValue === 'function'
                  ? { ...getter(), [formGroupName]: { ...functionOrValue(formGroupSliceGetter()) } }
                  : { ...getter(), [formGroupName]: { ...functionOrValue } }
              ),
          ];
        });
      } else {
        const $formControl = getFormControl($child);

        if ($formControl) {
          const formControlName = getFormControlName($formControl);

          if (formControlName) {
            if (!formGroupKeys.includes(formControlName)) {
              throw new FormControlInvalidKeyError(formControlName);
            }

            createRenderEffect(() => {
              if (getInputValueType($formControl.type) === 'string') {
                const formValue = getFormGroup()[formControlName];
                if (isString(formValue) || isNull(formValue)) {
                  $formControl.value = formValue as string;
                } else {
                  throw new FormControlInvalidTypeError(formControlName, 'string', formValue);
                }
              }
              if (getInputValueType($formControl.type) === 'radio') {
                const formValue = getFormGroup()[formControlName];
                if (isString(formValue) || isNull(formValue)) {
                  $formControl.checked = $formControl.value === formValue;
                } else {
                  throw new FormControlInvalidTypeError(formControlName, 'string', formValue);
                }
              }
              if (getInputValueType($formControl.type) === 'number') {
                const formValue = getFormGroup()[formControlName];
                if (isNumber(formValue)) {
                  $formControl.valueAsNumber = formValue;
                } else if (isNull(formValue)) {
                  $formControl.value = formValue as unknown as string;
                } else {
                  throw new FormControlInvalidTypeError(formControlName, 'number', formValue);
                }
              }
              if (getInputValueType($formControl.type) === 'boolean') {
                const formValue = getFormGroup()[formControlName];
                if (isBoolean(formValue)) {
                  $formControl.checked = formValue;
                } else if (isNull(formValue)) {
                  $formControl.checked = false;
                } else {
                  throw new FormControlInvalidTypeError(formControlName, 'boolean', formValue);
                }
              }
              if (getInputValueType($formControl.type) === 'date') {
                const newValue = getFormGroup()[formControlName];
                if (isDate(newValue) || isNull(newValue)) {
                  $formControl.valueAsDate = newValue;
                } else {
                  throw new FormControlInvalidTypeError(formControlName, 'date', newValue);
                }
              }
              if (getInputValueType($formControl.type) === 'datetime-local') {
                const formValue = getFormGroup()[formControlName];
                if (isString(formValue) || isNull(formValue)) {
                  $formControl.value = formValue as string;
                } else if (isNumber(formValue)) {
                  $formControl.valueAsNumber = formValue;
                } else {
                  throw new FormControlInvalidTypeError(formControlName, ['number', 'string'], formValue);
                }
              }
            });

            const onInput = () => {
              if (
                getInputValueType($formControl.type) === 'string' ||
                getInputValueType($formControl.type) === 'radio'
              ) {
                setFormGroup((s) => ({ ...s, [formControlName]: $formControl.value }));
              }
              if (getInputValueType($formControl.type) === 'number') {
                if (!Number.isNaN($formControl.valueAsNumber)) {
                  setFormGroup((s) => ({ ...s, [formControlName]: $formControl.valueAsNumber }));
                }
              }
              if (getInputValueType($formControl.type) === 'boolean') {
                setFormGroup((s) => ({ ...s, [formControlName]: $formControl.checked }));
              }
              if (getInputValueType($formControl.type) === 'date') {
                setFormGroup((s) => ({ ...s, [formControlName]: $formControl.valueAsDate }));
              }
              if (getInputValueType($formControl.type) === 'datetime-local') {
                const formValue = getFormGroup()[formControlName];
                if (isString(formValue) || isNull(formValue)) {
                  setFormGroup((s) => ({ ...s, [formControlName]: $formControl.value }));
                }
                if (isNumber(formValue)) {
                  setFormGroup((s) => ({ ...s, [formControlName]: $formControl.valueAsNumber }));
                }
              }
            };
            $formControl.addEventListener('input', onInput);
            onCleanup(() => $formControl.removeEventListener('input', onInput));
          }
        }
      }
    }
  }
}

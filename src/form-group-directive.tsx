import type { JSX } from 'solid-js';
import type { FormGroupSignal, FormGroupValue } from './types';
import { createRenderEffect, onCleanup } from 'solid-js';
import isArrayElement from './utils/guards/is-array-element';
import getFormControlName from './utils/get-form-control-name';
import { FormControlInvalidKeyError, FormControlInvalidTypeError } from './utils/errors';
import { getInputValueType } from './utils/input-element.utils';
import { isBoolean, isDate, isNull, isNumber, isString } from './utils/guards';

export function formGroup<T extends FormGroupValue>(
  el: JSX.FormHTMLAttributes<HTMLFormElement>,
  formGroupSignal: () => FormGroupSignal<T>
) {
  if (el && isArrayElement(el.children)) {
    const [getFormGroup, setFormGroup] = formGroupSignal();
    const formGroupKeys = Object.keys(getFormGroup());

    for (const child of el.children) {
      if (child instanceof HTMLInputElement) {
        const formControlName = getFormControlName(child);

        if (formControlName) {
          if (!formGroupKeys.includes(formControlName)) {
            throw new FormControlInvalidKeyError(formControlName);
          }

          createRenderEffect(() => {
            if (getInputValueType(child.type) === 'string') {
              const newValue = getFormGroup()[formControlName];
              if (!isString(newValue)) {
                throw new FormControlInvalidTypeError(formControlName, 'string', newValue);
              }
              child.value = newValue;
            }
            if (getInputValueType(child.type) === 'radio') {
              const newValue = getFormGroup()[formControlName];
              if (!isString(newValue)) {
                throw new FormControlInvalidTypeError(formControlName, 'string', newValue);
              }
              if (child.value === newValue) {
                child.checked = true;
              }
            }
            if (getInputValueType(child.type) === 'number') {
              const newValue = getFormGroup()[formControlName];
              if (!isNumber(newValue)) {
                throw new FormControlInvalidTypeError(formControlName, 'number', newValue);
              }
              child.valueAsNumber = newValue;
            }
            if (getInputValueType(child.type) === 'boolean') {
              const newValue = getFormGroup()[formControlName];
              if (!isBoolean(newValue)) {
                throw new FormControlInvalidTypeError(formControlName, 'boolean', newValue);
              }
              child.checked = newValue;
            }
            if (getInputValueType(child.type) === 'date') {
              const newValue = getFormGroup()[formControlName];
              if (!isDate(newValue) && !isNull(newValue)) {
                throw new FormControlInvalidTypeError(formControlName, 'date', newValue);
              }
              child.valueAsDate = newValue;
            }
            if (getInputValueType(child.type) === 'datetime-local') {
              const formValue = getFormGroup()[formControlName];
              if (!isNumber(formValue) && !isString(formValue)) {
                throw new FormControlInvalidTypeError(formControlName, ['number', 'string'], formValue);
              }
              if (isString(formValue)) {
                child.value = formValue;
              }
              if (isNumber(formValue)) {
                child.valueAsNumber = formValue;
              }
            }
          });

          const onInput = () => {
            if (getInputValueType(child.type) === 'string' || getInputValueType(child.type) === 'radio') {
              setFormGroup((s) => ({ ...s, [formControlName]: child.value }));
            }
            if (getInputValueType(child.type) === 'number') {
              if (!Number.isNaN(child.valueAsNumber)) {
                setFormGroup((s) => ({ ...s, [formControlName]: child.valueAsNumber }));
              }
            }
            if (getInputValueType(child.type) === 'boolean') {
              setFormGroup((s) => ({ ...s, [formControlName]: child.checked }));
            }
            if (getInputValueType(child.type) === 'date') {
              setFormGroup((s) => ({ ...s, [formControlName]: child.valueAsDate }));
            }
            if (getInputValueType(child.type) === 'datetime-local') {
              const formValue = getFormGroup()[formControlName];
              if (isString(formValue)) {
                setFormGroup((s) => ({ ...s, [formControlName]: child.value }));
              }
              if (isNumber(formValue)) {
                setFormGroup((s) => ({ ...s, [formControlName]: child.valueAsNumber }));
              }
            }
          };
          child.addEventListener('input', onInput);
          onCleanup(() => child.removeEventListener('input', onInput));
        }
      }
    }
  }
}

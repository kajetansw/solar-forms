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
              const formValue = getFormGroup()[formControlName];
              if (isString(formValue) || isNull(formValue)) {
                child.value = formValue as string;
              } else {
                throw new FormControlInvalidTypeError(formControlName, 'string', formValue);
              }
            }
            if (getInputValueType(child.type) === 'radio') {
              const formValue = getFormGroup()[formControlName];
              if (isString(formValue) || isNull(formValue)) {
                child.checked = child.value === formValue;
              } else {
                throw new FormControlInvalidTypeError(formControlName, 'string', formValue);
              }
            }
            if (getInputValueType(child.type) === 'number') {
              const formValue = getFormGroup()[formControlName];
              if (isNumber(formValue)) {
                child.valueAsNumber = formValue;
              } else if (isNull(formValue)) {
                child.value = formValue as unknown as string;
              } else {
                throw new FormControlInvalidTypeError(formControlName, 'number', formValue);
              }
            }
            if (getInputValueType(child.type) === 'boolean') {
              const formValue = getFormGroup()[formControlName];
              if (isBoolean(formValue)) {
                child.checked = formValue;
              } else if (isNull(formValue)) {
                child.checked = false;
              } else {
                throw new FormControlInvalidTypeError(formControlName, 'boolean', formValue);
              }
            }
            if (getInputValueType(child.type) === 'date') {
              const newValue = getFormGroup()[formControlName];
              if (isDate(newValue) || isNull(newValue)) {
                child.valueAsDate = newValue;
              } else {
                throw new FormControlInvalidTypeError(formControlName, 'date', newValue);
              }
            }
            if (getInputValueType(child.type) === 'datetime-local') {
              const formValue = getFormGroup()[formControlName];
              if (isString(formValue) || isNull(formValue)) {
                child.value = formValue as string;
              } else if (isNumber(formValue)) {
                child.valueAsNumber = formValue;
              } else {
                throw new FormControlInvalidTypeError(formControlName, ['number', 'string'], formValue);
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
              if (isString(formValue) || isNull(formValue)) {
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

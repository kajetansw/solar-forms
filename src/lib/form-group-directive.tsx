import type { JSX, Signal } from 'solid-js';
import type { FormGroupValue } from './types';
import { createRenderEffect, onCleanup } from 'solid-js';
import isArrayElement from '../utils/is-array-element';
import getFormControlName from '../utils/get-form-control-name';
import { FormControlInvalidKeyError, FormControlInvalidTypeError } from '../utils/errors';
import { getInputValueType } from '../utils/input-element.utils';

export function formGroup(
  el: JSX.FormHTMLAttributes<HTMLFormElement>,
  formGroupSignal: () => Signal<FormGroupValue>
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
              if (typeof newValue !== 'string') {
                throw new FormControlInvalidTypeError(formControlName, 'text', newValue);
              }
              child.value = newValue;
            }
            if (getInputValueType(child.type) === 'radio') {
              const newValue = getFormGroup()[formControlName];
              if (typeof newValue !== 'string') {
                throw new FormControlInvalidTypeError(formControlName, 'radio', newValue);
              }
              if (child.value === newValue) {
                child.checked = true;
              }
            }
            if (getInputValueType(child.type) === 'number') {
              const newValue = getFormGroup()[formControlName];
              if (typeof newValue !== 'number') {
                throw new FormControlInvalidTypeError(formControlName, 'number', newValue);
              }
              child.valueAsNumber = newValue;
            }
            if (getInputValueType(child.type) === 'boolean') {
              const newValue = getFormGroup()[formControlName];
              if (typeof newValue !== 'boolean') {
                throw new FormControlInvalidTypeError(formControlName, 'checkbox', newValue);
              }
              child.checked = newValue;
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
          };
          child.addEventListener('input', onInput);
          onCleanup(() => child.removeEventListener('input', onInput));
        }
      }
    }
  }
}

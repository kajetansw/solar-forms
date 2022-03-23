import { createEffect, createRenderEffect, onCleanup } from 'solid-js';
import getFormControlName from '../../utils/get-form-control-name';
import { FormControlInvalidKeyError, FormControlInvalidTypeError } from '../../utils/errors';
import { getInputValueType } from '../../utils/input-element.utils';
import { isArrayElement, isBoolean, isDate, isNull, isNumber, isString } from '../../guards';
import { getFormControl } from '../../utils/get-form-control';
import getFormGroupName from '../../utils/get-form-group-name';
import { CreateFormGroupInput } from '../create-form-group/types';
import { FormGroup } from './types';
import { toNestedFormGroupSignal } from './to-nested-form-group-signal';

export function formGroup<I extends CreateFormGroupInput>(el: Element, formGroupSignal: () => FormGroup<I>) {
  if (el && isArrayElement(el.children)) {
    const [value, setValue] = formGroupSignal().value;
    const [getDisabled] = formGroupSignal().disabled;
    const formGroupKeys = Object.keys(value());

    for (const $child of el.children) {
      const formGroupName = getFormGroupName($child);
      if (formGroupName) {
        formGroup($child, toNestedFormGroupSignal(formGroupSignal, formGroupName));
      } else {
        const $formControl = getFormControl($child);

        if ($formControl) {
          const formControlName = getFormControlName($formControl);

          if (formControlName) {
            if (!formGroupKeys.includes(formControlName)) {
              throw new FormControlInvalidKeyError(formControlName);
            }

            createEffect(() => {
              const disabledValue = getDisabled()[formControlName];
              if (isBoolean(disabledValue)) {
                $formControl.disabled = disabledValue;
              }
            });

            createRenderEffect(() => {
              if (getInputValueType($formControl.type) === 'string') {
                const formValue = value()[formControlName];
                if (isString(formValue) || isNull(formValue)) {
                  $formControl.value = formValue as string;
                } else {
                  throw new FormControlInvalidTypeError(formControlName, 'string', formValue);
                }
              }
              if (getInputValueType($formControl.type) === 'radio') {
                const formValue = value()[formControlName];
                if (isString(formValue) || isNull(formValue)) {
                  $formControl.checked = $formControl.value === formValue;
                } else {
                  throw new FormControlInvalidTypeError(formControlName, 'string', formValue);
                }
              }
              if (getInputValueType($formControl.type) === 'number') {
                const formValue = value()[formControlName];
                if (isNumber(formValue)) {
                  $formControl.valueAsNumber = formValue;
                } else if (isNull(formValue)) {
                  $formControl.value = formValue as unknown as string;
                } else {
                  throw new FormControlInvalidTypeError(formControlName, 'number', formValue);
                }
              }
              if (getInputValueType($formControl.type) === 'boolean') {
                const formValue = value()[formControlName];
                if (isBoolean(formValue)) {
                  $formControl.checked = formValue;
                } else if (isNull(formValue)) {
                  $formControl.checked = false;
                } else {
                  throw new FormControlInvalidTypeError(formControlName, 'boolean', formValue);
                }
              }
              if (getInputValueType($formControl.type) === 'date') {
                const formValue = value()[formControlName];
                if (isString(formValue) || isNull(formValue)) {
                  $formControl.value = formValue as string;
                } else if (isDate(formValue)) {
                  $formControl.valueAsDate = formValue;
                } else if (isNumber(formValue)) {
                  $formControl.valueAsNumber = formValue;
                } else {
                  throw new FormControlInvalidTypeError(
                    formControlName,
                    ['number', 'string', 'date'],
                    formValue
                  );
                }
              }
              if (getInputValueType($formControl.type) === 'datetime-local') {
                const formValue = value()[formControlName];
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
                setValue((s) => ({ ...s, [formControlName]: $formControl.value }));
              }
              if (getInputValueType($formControl.type) === 'number') {
                if (!Number.isNaN($formControl.valueAsNumber)) {
                  setValue((s) => ({ ...s, [formControlName]: $formControl.valueAsNumber }));
                }
              }
              if (getInputValueType($formControl.type) === 'boolean') {
                setValue((s) => ({ ...s, [formControlName]: $formControl.checked }));
              }
              if (getInputValueType($formControl.type) === 'date') {
                const formValue = value()[formControlName];
                if (isString(formValue) || isNull(formValue)) {
                  setValue((s) => ({ ...s, [formControlName]: $formControl.value }));
                }
                if (isNumber(formValue)) {
                  setValue((s) => ({ ...s, [formControlName]: $formControl.valueAsNumber }));
                }
                if (isDate(formValue)) {
                  setValue((s) => ({ ...s, [formControlName]: $formControl.valueAsDate }));
                }
              }
              if (getInputValueType($formControl.type) === 'datetime-local') {
                const formValue = value()[formControlName];
                if (isString(formValue) || isNull(formValue)) {
                  setValue((s) => ({ ...s, [formControlName]: $formControl.value }));
                }
                if (isNumber(formValue)) {
                  setValue((s) => ({ ...s, [formControlName]: $formControl.valueAsNumber }));
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

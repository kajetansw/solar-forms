import { createEffect, createRenderEffect, onCleanup } from 'solid-js';
import {
  FormControlInvalidKeyError,
  FormControlInvalidNestedGroupError,
  FormControlInvalidTypeError,
} from '../../errors';
import { isArrayElement, isBoolean, isDate, isNull, isNumber, isString } from '../../guards';
import { getFormControl } from './utils/get-form-control';
import { CreateFormGroupInput } from '../create-form-group/types';
import { FormGroup } from './types';
import { toNestedFormGroupSignal } from './utils/to-nested-form-group-signal';
import { getFormControlName } from './utils/get-form-control-name';
import { getFormGroupName } from './utils/get-form-group-name';
import { getInputValueType } from './utils/get-input-value-type';

export function formGroup<I extends CreateFormGroupInput>(el: Element, formGroupSignal: () => FormGroup<I>) {
  if (el && isArrayElement(el.children)) {
    const [value, setValue] = formGroupSignal().value;
    const [getDisabled] = formGroupSignal().disabled;
    const [dirty, setDirty] = formGroupSignal().dirty;
    const setToDirtyIfPristine = (formControlName: string | undefined) => {
      if (formControlName && !dirty()[formControlName]) {
        setDirty((s) => ({ ...s, [formControlName]: true }));
      }
    };

    if (!value()) {
      throw new FormControlInvalidNestedGroupError(getFormGroupName(el));
    }

    const formGroupKeys = Object.keys(value());

    for (const $child of el.children) {
      const formGroupName = getFormGroupName($child);
      if (formGroupName) {
        // Handle nested form groups
        formGroup($child, toNestedFormGroupSignal(formGroupSignal, formGroupName));
      } else {
        const $formControl = getFormControl($child);

        if ($formControl) {
          const formControlName = getFormControlName($formControl);

          if (formControlName) {
            if (!formGroupKeys.includes(formControlName)) {
              throw new FormControlInvalidKeyError(formControlName);
            }

            // Set form control as disabled or enabled
            createEffect(() => {
              const disabledValue = getDisabled()[formControlName];
              if (isBoolean(disabledValue)) {
                $formControl.disabled = disabledValue;
              }
            });

            // Set value of form control element
            createRenderEffect(() => {
              const inputType = getInputValueType($formControl.type);

              if (inputType === 'string') {
                const formValue = value()[formControlName];
                if (isString(formValue) || isNull(formValue)) {
                  $formControl.value = formValue as string;
                } else {
                  throw new FormControlInvalidTypeError(formControlName, 'string', formValue);
                }
              }
              if (inputType === 'radio') {
                const formValue = value()[formControlName];
                if (isString(formValue) || isNull(formValue)) {
                  $formControl.checked = $formControl.value === formValue;
                } else {
                  throw new FormControlInvalidTypeError(formControlName, 'string', formValue);
                }
              }
              if (inputType === 'number') {
                const formValue = value()[formControlName];
                if (isNumber(formValue)) {
                  $formControl.valueAsNumber = formValue;
                } else if (isNull(formValue)) {
                  $formControl.value = formValue as unknown as string;
                } else {
                  throw new FormControlInvalidTypeError(formControlName, 'number', formValue);
                }
              }
              if (inputType === 'boolean') {
                const formValue = value()[formControlName];
                if (isBoolean(formValue)) {
                  $formControl.checked = formValue;
                } else if (isNull(formValue)) {
                  $formControl.checked = false;
                } else {
                  throw new FormControlInvalidTypeError(formControlName, 'boolean', formValue);
                }
              }
              if (inputType === 'date' || inputType === 'time') {
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
              if (inputType === 'datetime-local') {
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

            // Update form group value on user input
            const onInput = () => {
              const inputType = getInputValueType($formControl.type);

              if (inputType === 'string' || inputType === 'radio') {
                setValue((s) => ({ ...s, [formControlName]: $formControl.value }));
                setToDirtyIfPristine(formControlName);
              }
              if (inputType === 'number') {
                if (!Number.isNaN($formControl.valueAsNumber)) {
                  setValue((s) => ({ ...s, [formControlName]: $formControl.valueAsNumber }));
                  setToDirtyIfPristine(formControlName);
                }
              }
              if (inputType === 'boolean') {
                setValue((s) => ({ ...s, [formControlName]: $formControl.checked }));
                setToDirtyIfPristine(formControlName);
              }
              if (inputType === 'date' || inputType === 'time') {
                const formValue = value()[formControlName];
                if (isString(formValue) || isNull(formValue)) {
                  setValue((s) => ({ ...s, [formControlName]: $formControl.value }));
                  setToDirtyIfPristine(formControlName);
                }
                if (isNumber(formValue)) {
                  setValue((s) => ({ ...s, [formControlName]: $formControl.valueAsNumber }));
                  setToDirtyIfPristine(formControlName);
                }
                if (isDate(formValue)) {
                  setValue((s) => ({ ...s, [formControlName]: $formControl.valueAsDate }));
                  setToDirtyIfPristine(formControlName);
                }
              }
              if (inputType === 'datetime-local') {
                const formValue = value()[formControlName];
                if (isString(formValue) || isNull(formValue)) {
                  setValue((s) => ({ ...s, [formControlName]: $formControl.value }));
                  setToDirtyIfPristine(formControlName);
                }
                if (isNumber(formValue)) {
                  setValue((s) => ({ ...s, [formControlName]: $formControl.valueAsNumber }));
                  setToDirtyIfPristine(formControlName);
                }
              }
            };
            $formControl.addEventListener('input', onInput);

            // Clean up
            onCleanup(() => $formControl.removeEventListener('input', onInput));
          }
        }
      }
    }
  }
}

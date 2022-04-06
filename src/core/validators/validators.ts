import { FormControl } from '../../types';
import { isNull, isNumber, isString } from '../../guards';
import { isUndefined } from '../../guards/is-undefined';
import { FormGroupPrimitive } from '../create-form-group/types';

const isEmpty = (value: FormGroupPrimitive) =>
  isNull(value) || isUndefined(value) || Number.isNaN(value) || value === '';

export const Validators = {
  required: (formControl: FormControl) => {
    const formValue = formControl.value;
    return isEmpty(formValue) ? { required: true } : null;
  },

  min: (value: number) => (formControl: FormControl) => {
    const formValue = formControl.value;

    if (isEmpty(formValue)) {
      return null;
    } else if (isNumber(formValue)) {
      return formValue >= value ? null : { min: true };
    }
    return null;
  },

  max: (value: number) => (formControl: FormControl) => {
    const formValue = formControl.value;

    if (isEmpty(formValue)) {
      return null;
    } else if (isNumber(formValue)) {
      return formValue <= value ? null : { max: true };
    }
    return null;
  },

  is: (value: string | number | boolean | null) => (formControl: FormControl) => {
    const formValue = formControl.value;
    return formValue === value ? null : { is: true };
  },

  isAnyOf: (arr: string[] | number[]) => (formControl: FormControl) => {
    const formValue = formControl.value;

    if (isEmpty(formValue)) {
      return null;
    }

    const isStringArray = (value: unknown): value is string[] =>
      Array.isArray(value) && value.every(isString);
    const isNumberArray = (value: unknown): value is number[] =>
      Array.isArray(value) && value.every(isNumber);

    const formValueIncluded =
      (isString(formValue) && isStringArray(arr) && arr.includes(formValue)) ||
      (isNumber(formValue) && isNumberArray(arr) && arr.includes(formValue));
    const typesMismatch =
      (isString(formValue) && isNumberArray(arr)) || (isNumber(formValue) && isStringArray(arr));

    return formValueIncluded || typesMismatch ? null : { isAny: true };
  },
};

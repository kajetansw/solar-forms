import { FormControl } from '../../types';
import { isNull, isNumber, isString } from '../../guards';
import { isUndefined } from '../../guards/is-undefined';
import { FormGroupPrimitive } from '../create-form-group/types';

const isEmpty = (value: FormGroupPrimitive) =>
  isNull(value) || isUndefined(value) || Number.isNaN(value) || value === '';

const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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

  minLength: (length: number) => (formControl: FormControl) => {
    const formValue = formControl.value;

    if (isEmpty(formValue)) {
      return null;
    } else if (isString(formValue)) {
      return formValue.length >= length ? null : { minLength: true };
    }
    return null;
  },

  maxLength: (length: number) => (formControl: FormControl) => {
    const formValue = formControl.value;

    if (isEmpty(formValue)) {
      return null;
    } else if (isString(formValue)) {
      return formValue.length <= length ? null : { maxLength: true };
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

    return formValueIncluded ? null : { isAny: true };
  },

  email: (formControl: FormControl) => {
    const formValue = formControl.value;
    if (isEmpty(formValue)) {
      return null;
    }
    return isString(formValue) && EMAIL_REGEXP.test(formValue) ? null : { email: true };
  },

  pattern: (pat: string | RegExp) => {
    let regex: RegExp;
    let regexStr: string;
    if (typeof pat === 'string') {
      regexStr = '';

      if (pat.charAt(0) !== '^') {
        regexStr += '^';
      }

      regexStr += pat;

      if (pat.charAt(pat.length - 1) !== '$') {
        regexStr += '$';
      }

      regex = new RegExp(regexStr);
    } else {
      regexStr = pat.toString();
      regex = pat;
    }
    return (formControl: FormControl) => {
      const formValue = formControl.value;
      if (isEmpty(formValue)) {
        return null;
      }
      return isString(formValue) && regex.test(formValue)
        ? null
        : { pattern: { requiredPattern: regexStr, actualValue: formValue } };
    };
  },
};

import { FormGroupValueConfigTuple } from '../../types';
import { isString } from './is-string';
import { isNumber } from './is-number';
import { isBoolean } from './is-boolean';
import { isDate } from './is-date';
import { isNull } from './is-null';
import { isRecord } from './is-record';

export function isFormGroupValueConfigTuple(arg: unknown): arg is FormGroupValueConfigTuple {
  if (Array.isArray(arg) && arg.length == 2) {
    const formValue = arg[0];
    const formConfig = arg[1];

    return (
      (isString(formValue) ||
        isNumber(formValue) ||
        isBoolean(formValue) ||
        isDate(formValue) ||
        isNull(formValue)) &&
      isRecord(formConfig)
    );
  }
  return false;
}

import { FormGroupPrimitive } from '../../src/core/create-form-group/types';
import { FormControl } from '../../src';

const COMMON_FORM_CONTROL = {
  disabled: false,
  dirty: false,
  touched: false,
};

export const getFormControlWithValue = (value: FormGroupPrimitive): FormControl => ({
  ...COMMON_FORM_CONTROL,
  value,
});

import { ValidatorFn } from '../../types';

export type FormGroupPrimitive = string | number | boolean | Date | null;

type FormGroupConfig = {
  disabled?: boolean;
  validators?: ValidatorFn[];
};

export type FormGroupValueConfigTuple = [FormGroupPrimitive, FormGroupConfig];

export type CreateFormGroupInput = {
  [key: string]: FormGroupPrimitive | FormGroupValueConfigTuple | CreateFormGroupInput;
};

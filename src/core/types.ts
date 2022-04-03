import { CreateFormGroupInput, FormGroupValueConfigTuple } from './create-form-group/types';
import { ValidatorFn } from '../types';

/**
 * Type that maps `CreateFormGroupInput` to recursive record with keys and values from
 * form group input. Drops config tuple extracting form control value from it.
 */
export type ToFormGroupValue<T extends CreateFormGroupInput> = {
  [K in keyof T]: T[K] extends CreateFormGroupInput
    ? ToFormGroupValue<T[K]>
    : T[K] extends FormGroupValueConfigTuple
    ? T[K][0]
    : T[K];
};

/**
 * Type that maps `CreateFormGroupInput` to recursive record with keys from
 * form group input and booleans as values.
 */
export type ToFormGroupBooleanMap<T extends CreateFormGroupInput> = {
  [K in keyof T]: T[K] extends CreateFormGroupInput ? ToFormGroupBooleanMap<T[K]> : boolean;
};

/**
 * Type that maps `CreateFormGroupInput` to recursive record with keys from
 * form group input and validator array as values.
 */
export type ToFormGroupValidatorsMap<T extends CreateFormGroupInput> = {
  [K in keyof T]: T[K] extends CreateFormGroupInput ? ToFormGroupValidatorsMap<T[K]> : ValidatorFn[];
};

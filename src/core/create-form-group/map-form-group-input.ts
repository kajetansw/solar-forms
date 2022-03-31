import { isFormGroupValueConfigTuple, isRecord } from '../../guards';
import { CreateFormGroupInput } from './types';

/**
 * Type that maps `CreateFormGroupInput` to recursive record with keys from
 * form group input and booleans as values.
 */
export type ToFormGroupBooleanMap<T extends CreateFormGroupInput> = {
  [K in keyof T]: T[K] extends CreateFormGroupInput ? ToFormGroupBooleanMap<T[K]> : boolean;
};

export function toFormGroupDisabled<I extends CreateFormGroupInput, D extends ToFormGroupBooleanMap<I>>(
  initial: I
): D {
  let output = {} as D;
  const defaultDisabled = false;

  for (const key of Object.keys(initial)) {
    const vc = initial[key];

    if (isFormGroupValueConfigTuple(vc)) {
      output = {
        ...output,
        [key]: vc[1].disabled ?? defaultDisabled,
      };
    } else if (isRecord(vc)) {
      output = {
        ...output,
        [key]: toFormGroupDisabled(vc),
      };
    } else {
      output = {
        ...output,
        [key]: defaultDisabled,
      };
    }
  }

  return output;
}

export function toFormGroupBooleanMap<I extends CreateFormGroupInput, D extends ToFormGroupBooleanMap<I>>(
  initial: I
): D {
  let output = {} as D;
  const defaultDisabled = false;

  for (const key of Object.keys(initial)) {
    const vc = initial[key];

    if (isFormGroupValueConfigTuple(vc)) {
      output = {
        ...output,
        [key]: defaultDisabled,
      };
    } else if (isRecord(vc)) {
      output = {
        ...output,
        [key]: toFormGroupBooleanMap(vc),
      };
    } else {
      output = {
        ...output,
        [key]: defaultDisabled,
      };
    }
  }

  return output;
}

import { isFormGroupValueConfigTuple, isRecord } from '../../guards';
import { CreateFormGroupInput } from './types';

export type ToFormGroupDisabled<T extends CreateFormGroupInput> = {
  [K in keyof T]: T[K] extends CreateFormGroupInput ? ToFormGroupDisabled<T[K]> : boolean;
};

export function toFormGroupDisabled<I extends CreateFormGroupInput, D extends ToFormGroupDisabled<I>>(
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

import { isFormGroupValueConfigTuple, isRecord } from '../../guards';
import { CreateFormGroupInput, FormGroupValueConfigTuple } from './types';

export type ToFormGroupValue<T extends CreateFormGroupInput> = {
  [K in keyof T]: T[K] extends CreateFormGroupInput
    ? ToFormGroupValue<T[K]>
    : T[K] extends FormGroupValueConfigTuple
    ? T[K][0]
    : T[K];
};

export function toFormGroupValue<I extends CreateFormGroupInput, V extends ToFormGroupValue<I>>(
  initial: I
): V {
  let output = {} as V;

  for (const key of Object.keys(initial)) {
    const vc = initial[key];

    if (isFormGroupValueConfigTuple(vc)) {
      output = {
        ...output,
        [key]: vc[0],
      };
    } else if (isRecord(vc)) {
      output = {
        ...output,
        [key]: toFormGroupValue(vc),
      };
    } else {
      output = {
        ...output,
        [key]: vc,
      };
    }
  }

  return output;
}

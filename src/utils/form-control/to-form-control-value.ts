import type { CreateFormGroupInput, ToFormGroupValue } from '../../types';
import { isFormGroupValueConfigTuple } from '../guards/is-form-group-value-config-tuple';
import { isRecord } from '../guards';

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

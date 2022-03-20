import type { CreateFormGroupInput } from '../../types';
import { isFormGroupValueConfigTuple } from '../guards/is-form-group-value-config-tuple';
import { isRecord } from '../guards';
import { FormGroupDisabled, ToFormGroupDisabled } from '../../types';

export function toFormGroupDisabled<I extends CreateFormGroupInput, D extends ToFormGroupDisabled<I>>(
  initial: I
): FormGroupDisabled<D> {
  let output = {} as FormGroupDisabled<D>;
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

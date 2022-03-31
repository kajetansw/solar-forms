import { isFormGroupValueConfigTuple, isRecord } from '../../guards';
import { CreateFormGroupInput } from './types';
import { ToFormGroupBooleanMap, ToFormGroupValue } from '../types';

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

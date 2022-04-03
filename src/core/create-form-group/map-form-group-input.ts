import { isFormGroupValueConfigTuple, isRecord } from '../../guards';
import { CreateFormGroupInput } from './types';
import {
  ToFormGroupBooleanMap,
  ToFormGroupValidationErrorsMap,
  ToFormGroupValidatorsMap,
  ToFormGroupValue,
} from '../types';
import { ValidatorFn } from '../../types';

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

export function toFormGroupValidatorsMap<
  I extends CreateFormGroupInput,
  V extends ToFormGroupValidatorsMap<I>
>(initial: I): V {
  let output = {} as V;
  const defaultValidators: ValidatorFn[] = [];

  for (const key of Object.keys(initial)) {
    const vc = initial[key];

    if (isFormGroupValueConfigTuple(vc)) {
      output = {
        ...output,
        [key]: vc[1].validators ?? defaultValidators,
      };
    } else if (isRecord(vc)) {
      output = {
        ...output,
        [key]: toFormGroupValidatorsMap(vc),
      };
    } else {
      output = {
        ...output,
        [key]: defaultValidators,
      };
    }
  }

  return output;
}

export function toFormGroupValidationErrorsMap<
  I extends CreateFormGroupInput,
  E extends ToFormGroupValidationErrorsMap<I>
>(initial: I): E {
  let output = {} as E;
  const defaultValidationErrors = null;

  for (const key of Object.keys(initial)) {
    const vc = initial[key];

    if (isFormGroupValueConfigTuple(vc)) {
      output = {
        ...output,
        [key]: defaultValidationErrors,
      };
    } else if (isRecord(vc)) {
      output = {
        ...output,
        [key]: toFormGroupValidationErrorsMap(vc),
      };
    } else {
      output = {
        ...output,
        [key]: defaultValidationErrors,
      };
    }
  }

  return output;
}

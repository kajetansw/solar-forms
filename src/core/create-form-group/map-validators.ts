import { FormGroup } from '../form-group-directive';
import {
  ToFormGroupBooleanMap,
  ToFormGroupValidationErrorsMap,
  ToFormGroupValidatorsMap,
  ToFormGroupValue,
} from '../types';
import { isRecord } from '../../guards';
import { CreateFormGroupInput, FormGroupPrimitive } from './types';
import { FormControl, ValidationErrors, ValidatorFn } from '../../types';

export const toValid =
  <I extends CreateFormGroupInput>(
    validatorsAccessor: FormGroup<I>['validators'][0],
    valueAccessor: FormGroup<I>['value'][0],
    disabledAccessor: FormGroup<I>['disabled'][0],
    dirtyAccessor: FormGroup<I>['dirty'][0],
    touchedAccessor: FormGroup<I>['touched'][0]
  ) =>
  (validState: ToFormGroupBooleanMap<I>) => {
    let output = {} as ToFormGroupBooleanMap<I>;
    const vs = validatorsAccessor();
    const v = valueAccessor();
    const dis = disabledAccessor();
    const dir = dirtyAccessor();
    const t = touchedAccessor();

    for (const key of Object.keys(validState)) {
      const current = validState[key];
      if (isRecord(current)) {
        output = {
          ...output,
          [key]: toValid(
            () => vs[key] as ToFormGroupValidatorsMap<CreateFormGroupInput>,
            () => v[key] as ToFormGroupValue<CreateFormGroupInput>,
            () => dis[key] as ToFormGroupBooleanMap<CreateFormGroupInput>,
            () => dir[key] as ToFormGroupBooleanMap<CreateFormGroupInput>,
            () => t[key] as ToFormGroupBooleanMap<CreateFormGroupInput>
          )(current as ToFormGroupBooleanMap<I>),
        };
      } else {
        const formControl = {
          value: v[key] as FormGroupPrimitive,
          disabled: dis[key] as boolean,
          dirty: dir[key] as boolean,
          touched: t[key] as boolean,
        };
        const currentValidators = vs[key] as ValidatorFn[];
        output = {
          ...output,
          [key]:
            currentValidators.length > 0
              ? currentValidators.every((validate) => !validate(formControl))
              : true,
        };
      }
    }

    return output;
  };

export const toValidationErrors =
  <I extends CreateFormGroupInput>(
    validatorsAccessor: FormGroup<I>['validators'][0],
    valueAccessor: FormGroup<I>['value'][0],
    disabledAccessor: FormGroup<I>['disabled'][0],
    dirtyAccessor: FormGroup<I>['dirty'][0],
    touchedAccessor: FormGroup<I>['touched'][0]
  ) =>
  () => {
    let output = {} as ToFormGroupValidationErrorsMap<I>;
    const vs = validatorsAccessor();
    const v = valueAccessor();
    const dis = disabledAccessor();
    const dir = dirtyAccessor();
    const t = touchedAccessor();

    for (const key of Object.keys(v)) {
      const current = v[key];
      if (isRecord(current)) {
        output = {
          ...output,
          [key]: toValidationErrors(
            () => vs[key] as ToFormGroupValidatorsMap<CreateFormGroupInput>,
            () => v[key] as ToFormGroupValue<CreateFormGroupInput>,
            () => dis[key] as ToFormGroupBooleanMap<CreateFormGroupInput>,
            () => dir[key] as ToFormGroupBooleanMap<CreateFormGroupInput>,
            () => t[key] as ToFormGroupBooleanMap<CreateFormGroupInput>
          )(),
        };
      } else {
        const formControl = {
          value: v[key] as FormGroupPrimitive,
          disabled: dis[key] as boolean,
          dirty: dir[key] as boolean,
          touched: t[key] as boolean,
        };
        const currentValidators = vs[key] as ValidatorFn[];
        output = {
          ...output,
          [key]: validatorsToErrors(currentValidators, formControl),
        };
      }
    }

    return output;
  };

function validatorsToErrors(validatorFns: ValidatorFn[], formControl: FormControl): ValidationErrors | null {
  const validatorsToErrors = validatorFns
    .map((validate) => validate(formControl))
    .filter((err) => err !== null);

  if (validatorsToErrors.length === 0) {
    return null;
  }

  return validatorsToErrors.reduce((acc, curr) => ({ ...acc, ...curr }), {});
}

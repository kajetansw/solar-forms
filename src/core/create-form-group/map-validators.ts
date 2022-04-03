import { FormGroup } from '../form-group-directive';
import { ToFormGroupBooleanMap } from '../types';
import { isRecord } from '../../guards';
import { CreateFormGroupInput, FormGroupPrimitive } from './types';
import { ValidatorFn } from '../../types';

type TODO = any;

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
            () => vs[key] as TODO,
            () => v[key] as TODO,
            () => dis[key] as TODO,
            () => dir[key] as TODO,
            () => t[key] as TODO
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

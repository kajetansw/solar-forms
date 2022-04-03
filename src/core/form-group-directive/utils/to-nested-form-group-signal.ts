import { CreateFormGroupInput } from '../../create-form-group/types';
import { FormGroup } from '../types';
import { ToFormGroupBooleanMap, ToFormGroupValidatorsMap, ToFormGroupValue } from '../../types';

export function toNestedFormGroupSignal<I extends CreateFormGroupInput, K extends keyof I>(
  formGroupSignal: () => FormGroup<I>,
  formGroupName: K
): () => FormGroup<CreateFormGroupInput> {
  return () => {
    const [value, setValue] = formGroupSignal().value;
    const [disabled, setDisabled] = formGroupSignal().disabled;
    const [disabledAll, setDisabledAll] = formGroupSignal().disabledAll;
    const [dirty, setDirty] = formGroupSignal().dirty;
    const [dirtyAll, setDirtyAll] = formGroupSignal().dirtyAll;
    const [touched, setTouched] = formGroupSignal().touched;
    const [touchedAll, setTouchedAll] = formGroupSignal().touchedAll;
    const [validators, setValidators] = formGroupSignal().validators;
    const valid = formGroupSignal().valid;

    const valueSliceGetter = () => value()[formGroupName] as ToFormGroupValue<CreateFormGroupInput>;
    const disabledSliceGetter = () =>
      disabled()[formGroupName] as ToFormGroupBooleanMap<CreateFormGroupInput>;
    const dirtySliceGetter = () => dirty()[formGroupName] as ToFormGroupBooleanMap<CreateFormGroupInput>;
    const touchedSliceGetter = () => touched()[formGroupName] as ToFormGroupBooleanMap<CreateFormGroupInput>;
    const validatorsSliceGetter = () =>
      validators()[formGroupName] as ToFormGroupValidatorsMap<CreateFormGroupInput>;
    const validSliceGetter = () => valid()[formGroupName] as ToFormGroupBooleanMap<CreateFormGroupInput>;

    return {
      value: [
        valueSliceGetter,
        (functionOrValue) =>
          setValue(
            typeof functionOrValue === 'function'
              ? { ...value(), [formGroupName]: { ...functionOrValue(valueSliceGetter()) } }
              : { ...value(), [formGroupName]: { ...functionOrValue } }
          ),
      ],
      disabled: [
        disabledSliceGetter,
        (functionOrValue) =>
          setDisabled(
            typeof functionOrValue === 'function'
              ? { ...disabled(), [formGroupName]: { ...functionOrValue(disabledSliceGetter()) } }
              : { ...disabled(), [formGroupName]: { ...functionOrValue } }
          ),
      ],
      disabledAll: [disabledAll, setDisabledAll],
      dirty: [
        dirtySliceGetter,
        (functionOrValue) =>
          setDirty(
            typeof functionOrValue === 'function'
              ? { ...dirty(), [formGroupName]: { ...functionOrValue(dirtySliceGetter()) } }
              : { ...dirty(), [formGroupName]: { ...functionOrValue } }
          ),
      ],
      dirtyAll: [dirtyAll, setDirtyAll],
      touched: [
        touchedSliceGetter,
        (functionOrValue) =>
          setTouched(
            typeof functionOrValue === 'function'
              ? { ...touched(), [formGroupName]: { ...functionOrValue(touchedSliceGetter()) } }
              : { ...touched(), [formGroupName]: { ...functionOrValue } }
          ),
      ],
      touchedAll: [touchedAll, setTouchedAll],
      validators: [
        validatorsSliceGetter,
        (functionOrValue) =>
          setValidators(
            typeof functionOrValue === 'function'
              ? { ...validators(), [formGroupName]: { ...functionOrValue(validatorsSliceGetter()) } }
              : { ...validators(), [formGroupName]: { ...functionOrValue } }
          ),
      ],
      valid: validSliceGetter,
    };
  };
}

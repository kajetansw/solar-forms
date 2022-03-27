import { CreateFormGroupInput } from '../create-form-group/types';
import { FormGroup } from './types';
import { ToFormGroupValue } from '../create-form-group/to-form-control-value';
import { ToFormGroupDisabled } from '../create-form-group/to-form-control-disabled';

export function toNestedFormGroupSignal<I extends CreateFormGroupInput, K extends keyof I>(
  formGroupSignal: () => FormGroup<I>,
  formGroupName: K
): () => FormGroup<CreateFormGroupInput> {
  return () => {
    const [value, setValue] = formGroupSignal().value;
    const [disabled, setDisabled] = formGroupSignal().disabled;
    const [disabledAll, setDisabledAll] = formGroupSignal().disabledAll;

    const valueSliceGetter = () => value()[formGroupName] as ToFormGroupValue<CreateFormGroupInput>;
    const disabledSliceGetter = () => disabled()[formGroupName] as ToFormGroupDisabled<CreateFormGroupInput>;

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
    };
  };
}

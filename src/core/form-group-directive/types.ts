import { CreateFormGroupInput } from '../create-form-group/types';
import { FormGroupSignal } from '../../types';
import { ToFormGroupValue } from '../create-form-group/to-form-control-value';
import { ToFormGroupBooleanMap } from '../create-form-group/map-form-group-input';

export interface FormGroup<I extends CreateFormGroupInput> {
  value: FormGroupSignal<ToFormGroupValue<I>>;
  disabled: FormGroupSignal<ToFormGroupBooleanMap<I>>;
  disabledAll: FormGroupSignal<boolean>;
  dirty: FormGroupSignal<ToFormGroupBooleanMap<I>>;
}

import { CreateFormGroupInput } from '../create-form-group/types';
import { FormGroupSignal } from '../../types';
import { ToFormGroupBooleanMap, ToFormGroupValue } from '../types';

export interface FormGroup<I extends CreateFormGroupInput> {
  value: FormGroupSignal<ToFormGroupValue<I>>;
  disabled: FormGroupSignal<ToFormGroupBooleanMap<I>>;
  disabledAll: FormGroupSignal<boolean>;
  dirty: FormGroupSignal<ToFormGroupBooleanMap<I>>;
  dirtyAll: FormGroupSignal<boolean>;
  touched: FormGroupSignal<ToFormGroupBooleanMap<I>>;
}

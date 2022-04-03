import { CreateFormGroupInput } from '../create-form-group/types';
import { FormGroupAccessor, FormGroupSignal } from '../../types';
import { ToFormGroupBooleanMap, ToFormGroupValidatorsMap, ToFormGroupValue } from '../types';

export interface FormGroup<I extends CreateFormGroupInput> {
  value: FormGroupSignal<ToFormGroupValue<I>>;
  disabled: FormGroupSignal<ToFormGroupBooleanMap<I>>;
  disabledAll: FormGroupSignal<boolean>;
  dirty: FormGroupSignal<ToFormGroupBooleanMap<I>>;
  dirtyAll: FormGroupSignal<boolean>;
  touched: FormGroupSignal<ToFormGroupBooleanMap<I>>;
  touchedAll: FormGroupSignal<boolean>;
  validators: FormGroupSignal<ToFormGroupValidatorsMap<I>>;
  valid: FormGroupAccessor<ToFormGroupBooleanMap<I>>;
  validAll: FormGroupAccessor<boolean>;
}

import { CreateFormGroupInput } from '../create-form-group/types';
import { FormGroupSignal } from '../../types';
import { ToFormGroupValue } from '../create-form-group/to-form-control-value';
import { ToFormGroupDisabled } from '../create-form-group/to-form-control-disabled';

export interface FormGroup<I extends CreateFormGroupInput> {
  value: FormGroupSignal<ToFormGroupValue<I>>;
  disabled: FormGroupSignal<ToFormGroupDisabled<I>>;
}

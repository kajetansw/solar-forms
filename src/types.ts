import { Accessor } from 'solid-js';
import { FormGroupPrimitive } from './core/create-form-group/types';

type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);

export type FormGroupAccessor<T> = Accessor<T>;
export type FormGroupSetter<T> = Dispatch<SetStateAction<T>>;
export type FormGroupSignal<T> = [FormGroupAccessor<T>, FormGroupSetter<T>];

export interface FormControl {
  value: FormGroupPrimitive;
  disabled: boolean;
  touched: boolean;
  dirty: boolean;
}

export type ValidationErrors = {
  [key: string]: unknown;
};

export interface ValidatorFn {
  (control: FormControl): ValidationErrors | null;
}

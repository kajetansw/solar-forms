import { Accessor } from 'solid-js';

type TODO = any;

type ValidationErrors = {
  [key: string]: TODO;
};

interface ValidatorFn {
  (control: TODO): ValidationErrors | null;
}

type FormGroupPrimitive = string | number | boolean | Date | null;

export type FormGroupValue = {
  [key: string]: FormGroupPrimitive | FormGroupValue;
};

export type FormGroupDisabled<T extends FormGroupValue> = {
  [K in keyof T]: T[K] extends FormGroupValue ? FormGroupDisabled<T[K]> : boolean;
};

export type FormGroupConfig = {
  disabled?: boolean;
  validators?: ValidatorFn[];
};

export type FormGroupValueConfigTuple = [FormGroupPrimitive, FormGroupConfig];

export type CreateFormGroupInput = {
  [key: string]: FormGroupPrimitive | FormGroupValueConfigTuple | CreateFormGroupInput;
};

export interface FormGroup<I extends CreateFormGroupInput> {
  value: FormGroupSignal<ToFormGroupValue<I>>;
  disabled: FormGroupSignal<ToFormGroupDisabled<I>>;
}

type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);

export type FormGroupAccessor<T> = Accessor<T>;
export type FormGroupSetter<T> = Dispatch<SetStateAction<T>>;
export type FormGroupSignal<T> = [FormGroupAccessor<T>, FormGroupSetter<T>];

export type ToFormGroupValue<T extends CreateFormGroupInput> = {
  [K in keyof T]: T[K] extends CreateFormGroupInput
    ? ToFormGroupValue<T[K]>
    : T[K] extends FormGroupValueConfigTuple
    ? T[K][0]
    : T[K];
};

export type ToFormGroupDisabled<T extends CreateFormGroupInput> = {
  [K in keyof T]: T[K] extends CreateFormGroupInput ? ToFormGroupDisabled<T[K]> : boolean;
};

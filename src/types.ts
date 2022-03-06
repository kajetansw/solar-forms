import { Accessor } from 'solid-js';

export type FormGroupValue = {
  [key: string]: string | number | boolean | Date | null;
};

type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);

export type FormGroupAccessor<T extends FormGroupValue> = Accessor<T>;
export type FormGroupSetter<T extends FormGroupValue> = Dispatch<SetStateAction<T>>;
export type FormGroupSignal<T extends FormGroupValue> = [FormGroupAccessor<T>, FormGroupSetter<T>];

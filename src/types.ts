import { Accessor } from 'solid-js';

type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);

export type FormGroupAccessor<T> = Accessor<T>;
export type FormGroupSetter<T> = Dispatch<SetStateAction<T>>;
export type FormGroupSignal<T> = [FormGroupAccessor<T>, FormGroupSetter<T>];

import { Signal } from 'solid-js';
import { FormGroupValue } from './types';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      formGroup?: Signal<FormGroupValue>;
    }

    interface InputHTMLAttributes<T> {
      formControlName?: string;
    }
  }
}

export * from './create-form-group';
export * from './form-group-directive';

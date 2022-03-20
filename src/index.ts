export * from './core/create-form-group';
export * from './core/form-group-directive';
export * from './types';

type Accessor = () => any;
type Setter = (v: any) => any;
type Signal = [Accessor, Setter];

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      // The only way for the directive to work without type errors
      formGroup?: {
        value: Signal;
        disabled: Signal;
      };
    }

    interface InputHTMLAttributes<T> {
      formControlName?: string;
    }

    interface HTMLAttributes<T> {
      formGroupName?: string;
    }
  }
}

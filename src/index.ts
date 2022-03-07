export * from './create-form-group';
export * from './form-group-directive';
export * from './types';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      // The only way for the directive to work without type errors
      formGroup?: [() => any, (v: any) => any];
    }

    interface InputHTMLAttributes<T> {
      formControlName?: string;
    }

    interface HTMLAttributes<T> {
      formGroupName?: string;
    }
  }
}

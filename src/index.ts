export * from './core/create-form-group';
export * from './core/form-group-directive';
export * from './types';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      // The only way for the directive to work without type errors
      // eslint-disable-next-line @typescript-eslint/ban-types
      formGroup?: {};
    }

    interface InputHTMLAttributes<T> {
      formControlName?: string;
    }

    interface HTMLAttributes<T> {
      formGroupName?: string;
    }
  }
}

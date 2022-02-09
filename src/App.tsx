import { createRenderEffect, createSignal, onCleanup } from 'solid-js';
import type { JSX, Component, Signal } from 'solid-js';
import getFormControlName from './utils/get-form-control-name';
import { FormGroupInvalidKeyError } from './utils/errors';
import isArrayElement from './utils/is-array-element';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      formGroup: Signal<FormGroupValue>;
    }

    interface InputHTMLAttributes<T> {
      formControlName: string;
    }
  }
}

type FormGroupValue = Record<string, string>;

function createFormGroup<T extends FormGroupValue>(initialValue: T): Signal<T> {
  const signal = createSignal(initialValue);
  return signal;
}

function formGroup(
  el: JSX.FormHTMLAttributes<HTMLFormElement>,
  formGroupSignal: () => Signal<FormGroupValue>
) {
  if (el && isArrayElement(el.children)) {
    const [getFormGroup, setFormGroup] = formGroupSignal();
    const formGroupKeys = Object.keys(getFormGroup());

    for (const child of el.children) {
      if (child instanceof HTMLInputElement) {
        const formControlName = getFormControlName(child);

        if (formControlName) {
          if (!formGroupKeys.includes(formControlName)) {
            throw new FormGroupInvalidKeyError(formControlName);
          }

          createRenderEffect(() => {
            child.value = getFormGroup()[formControlName];
          });
          const onInput = () => {
            setFormGroup((s) => ({ ...s, [formControlName]: child.value }));
          };
          child.addEventListener('input', onInput);
          onCleanup(() => child.removeEventListener('input', onInput));
        }
      }
    }
  }
}

const App: Component = () => {
  const [form, setForm] = createFormGroup({
    firstName: '',
  });

  // TODO for testing - remove when unnecessary
  // setInterval(() => console.log(form()), 1000);

  return (
    <>
      <p>First name: {form().firstName}</p>
      <hr />
      <form use:formGroup={[form, setForm]}>
        <label htmlFor="firstName">First name</label>
        <input id="firstName" type="text" formControlName="firstName" />
      </form>
      <button onClick={() => setForm((s) => ({ ...s, firstName: 'test' }))}>Change firstName</button>
    </>
  );
};

export default App;

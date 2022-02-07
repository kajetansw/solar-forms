import { Component, createRenderEffect, createSignal, onCleanup, Signal } from 'solid-js';
import type { JSX } from 'solid-js';
import { produce } from 'solid-js/store';

type TODO = any;

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      formGroup: Signal<FormGroupState>;
    }

    interface InputHTMLAttributes<T> {
      formControlName: string;
    }
  }
}

type FormGroupState = Record<string, string>;

function isArrayElement(el: unknown): el is JSX.ArrayElement {
  return el && typeof el === 'object' && (el as any)['length'];
}

function createFormGroup<T extends FormGroupState>(initialValue: T): Signal<T> {
  const signal = createSignal(initialValue);
  return signal;
}

function formGroup(
  el: JSX.FormHTMLAttributes<HTMLFormElement>,
  formGroupSignal: () => Signal<FormGroupState>
) {
  if (el && isArrayElement(el.children)) {
    for (const child of el.children) {
      if (child instanceof HTMLInputElement) {
        const [getFormGroup, setFormGroup] = formGroupSignal();
        const formControlName = child.attributes.getNamedItem('formControlName')?.value;

        if (formControlName) {
          createRenderEffect(() => {
            child.value = getFormGroup()[formControlName];
          });
          const onInput = () => {
            setFormGroup(
              produce((s) => {
                s[formControlName] = child.value;
              })
            );
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

  return (
    <>
      <form use:formGroup={[form, setForm]}>
        <input type="text" formControlName="firstName" />
      </form>
      <button onClick={() => setForm({ firstName: 'test' })}>CLICK</button>
    </>
  );
};

export default App;

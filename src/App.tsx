import type { Component, JSX, Signal } from 'solid-js';
import { createRenderEffect, createSignal, onCleanup } from 'solid-js';
import getFormControlName from './utils/get-form-control-name';
import { FormControlInvalidKeyError, FormControlInvalidTypeError } from './utils/errors';
import getRandomString from './utils/get-random-string';
import isArrayElement from './utils/is-array-element';
import ToJSON from './components/ToJSON';
import getRandomNumber from './utils/get-random-number';
import { getInputValueType } from './utils/input-element.utils';

import './App.css';

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

type FormGroupValue = Record<string, string | boolean | number>;

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
            throw new FormControlInvalidKeyError(formControlName);
          }

          createRenderEffect(() => {
            if (getInputValueType(child.type) === 'string') {
              const newValue = getFormGroup()[formControlName];
              if (typeof newValue !== 'string') {
                throw new FormControlInvalidTypeError(formControlName, 'text', newValue);
              }
              child.value = newValue;
            }
            if (getInputValueType(child.type) === 'number') {
              const newValue = getFormGroup()[formControlName];
              if (typeof newValue !== 'number') {
                throw new FormControlInvalidTypeError(formControlName, 'number', newValue);
              }
              if (!Number.isNaN(child.valueAsNumber)) {
                child.valueAsNumber = newValue;
              }
            }
            if (getInputValueType(child.type) === 'boolean') {
              const newValue = getFormGroup()[formControlName];
              if (typeof newValue !== 'boolean') {
                throw new FormControlInvalidTypeError(formControlName, 'checkbox', newValue);
              }
              child.checked = newValue;
            }
          });
          const onInput = () => {
            if (getInputValueType(child.type) === 'string') {
              setFormGroup((s) => ({ ...s, [formControlName]: child.value }));
            }
            if (getInputValueType(child.type) === 'number') {
              if (!Number.isNaN(child.valueAsNumber)) {
                setFormGroup((s) => ({ ...s, [formControlName]: child.valueAsNumber }));
              }
            }
            if (getInputValueType(child.type) === 'boolean') {
              setFormGroup((s) => ({ ...s, [formControlName]: child.checked }));
            }
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
    firstName: 'Thomas',
    email: 'thomas@thomas.com',
    password: '',
    phoneNumber: '',
    personalSite: '',
    age: 25,
    skillLevel: 20,
    acceptTerms: Math.random() < 0.5,
  });

  // TODO for testing - remove when redundant
  // setInterval(() => console.log(form()), 1000);

  return (
    <>
      <ToJSON value={form()} />

      <form use:formGroup={[form, setForm]}>
        <label htmlFor="firstName">First name</label>
        <input id="firstName" type="text" formControlName="firstName" />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" formControlName="email" />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" formControlName="password" />

        <label htmlFor="phoneNumber">Phone number</label>
        <input id="phoneNumber" type="tel" formControlName="phoneNumber" />

        <label htmlFor="personalSite">Personal site URL</label>
        <input id="personalSite" type="url" formControlName="personalSite" />

        <label htmlFor="age">Age</label>
        <input id="age" type="number" formControlName="age" />

        <label htmlFor="skillLevel">Skill level</label>
        <input id="skillLevel" type="range" formControlName="skillLevel" />

        <label htmlFor="acceptTerms">Accept terms</label>
        <input id="acceptTerms" type="checkbox" formControlName="acceptTerms" />
      </form>

      <button onClick={() => setForm((s) => ({ ...s, firstName: getRandomString() }))}>
        Change firstName
      </button>
      <button onClick={() => setForm((s) => ({ ...s, phoneNumber: getRandomString() }))}>
        Change phone number
      </button>
      <button onClick={() => setForm((s) => ({ ...s, age: getRandomNumber() }))}>Change age</button>
      <button onClick={() => setForm((s) => ({ ...s, skillLevel: 50 }))}>Change skillLevel</button>
      <button onClick={() => setForm((s) => ({ ...s, acceptTerms: !s.acceptTerms }))}>
        Change acceptTerms
      </button>
    </>
  );
};

export default App;

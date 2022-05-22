import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { For } from 'solid-js';
import { TEAMS } from '../utils/get-random-team';

const TestApp = () => {
  const fg = createFormGroup({
    controlEnabled1: 'test',
    controlEnabled2: ['test', { disabled: false }],
    controlDisabled3: ['test', { disabled: true }],
    control4: {
      controlEnabled41: 'test',
      controlEnabled42: ['test', { disabled: false }],
      controlDisabled43: ['test', { disabled: true }],
    },
  });
  const [disabled, setDisabled] = fg.disabled;

  return (
    <>
      <form use:formGroup={fg}>
        <label for="controlEnabled1">controlEnabled1</label>
        <select
          data-testid="select-controlEnabled1"
          name="controlEnabled1"
          id="controlEnabled1"
          formControlName="controlEnabled1"
        >
          <For each={TEAMS}>
            {(t) => (
              <option data-testid={`controlEnabled1-${t}`} value={t}>
                {t}
              </option>
            )}
          </For>
        </select>

        <label for="controlEnabled2">controlEnabled2</label>
        <select
          data-testid="select-controlEnabled2"
          name="controlEnabled2"
          id="controlEnabled2"
          formControlName="controlEnabled2"
        >
          <For each={TEAMS}>
            {(t) => (
              <option data-testid={`controlEnabled2-${t}`} value={t}>
                {t}
              </option>
            )}
          </For>
        </select>

        <label for="controlDisabled">controlDisabled3</label>
        <select
          data-testid="select-controlDisabled3"
          name="controlDisabled3"
          id="controlDisabled3"
          formControlName="controlDisabled3"
        >
          <For each={TEAMS}>
            {(t) => (
              <option data-testid={`controlDisabled3-${t}`} value={t}>
                {t}
              </option>
            )}
          </For>
        </select>

        <div formGroupName="control4">
          <label for="controlEnabled1">controlEnabled41</label>
          <select
            data-testid="select-controlEnabled41"
            name="controlEnabled41"
            id="controlEnabled41"
            formControlName="controlEnabled41"
          >
            <For each={TEAMS}>
              {(t) => (
                <option data-testid={`controlEnabled41-${t}`} value={t}>
                  {t}
                </option>
              )}
            </For>
          </select>

          <label for="controlEnabled42">controlEnabled42</label>
          <select
            data-testid="select-controlEnabled42"
            name="controlEnabled42"
            id="controlEnabled42"
            formControlName="controlEnabled42"
          >
            <For each={TEAMS}>
              {(t) => (
                <option data-testid={`controlEnabled42-${t}`} value={t}>
                  {t}
                </option>
              )}
            </For>
          </select>

          <label for="controlDisabled43">controlDisabled43</label>
          <select
            data-testid="select-controlDisabled43"
            name="controlDisabled43"
            id="controlDisabled43"
            formControlName="controlDisabled43"
          >
            <For each={TEAMS}>
              {(t) => (
                <option data-testid={`controlDisabled43-${t}`} value={t}>
                  {t}
                </option>
              )}
            </For>
          </select>
        </div>
      </form>

      <button
        data-testid="btn-controlEnabled1"
        onClick={() => setDisabled({ ...disabled(), controlEnabled1: true })}
      >
        Change controlEnabled1
      </button>

      <button
        data-testid="btn-controlEnabled2"
        onClick={() => setDisabled({ ...disabled(), controlEnabled2: true })}
      >
        Change controlEnabled2
      </button>

      <button
        data-testid="btn-controlEnabled41"
        onClick={() =>
          setDisabled({ ...disabled(), control4: { ...disabled().control4, controlEnabled41: true } })
        }
      >
        Change nested controlEnabled41
      </button>

      <button
        data-testid="btn-controlEnabled42"
        onClick={() =>
          setDisabled({ ...disabled(), control4: { ...disabled().control4, controlEnabled42: true } })
        }
      >
        Change nested controlEnabled42
      </button>
    </>
  );
};

describe('Disabling form controls and groups', () => {
  let $controlEnabled1: HTMLInputElement;
  let $controlEnabled2: HTMLInputElement;
  let $controlDisabled3: HTMLInputElement;
  let $nestedControlEnabled41: HTMLInputElement;
  let $nestedControlEnabled42: HTMLInputElement;
  let $nestedControlDisabled43: HTMLInputElement;
  let $btnControlEnabled1: HTMLElement;
  let $btnControlEnabled2: HTMLElement;
  let $btnNestedControlEnabled1: HTMLElement;
  let $btnNestedControlEnabled2: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $controlEnabled1 = (await screen.findByTestId('select-controlEnabled1')) as HTMLInputElement;
    $controlEnabled2 = (await screen.findByTestId('select-controlEnabled2')) as HTMLInputElement;
    $controlDisabled3 = (await screen.findByTestId('select-controlDisabled3')) as HTMLInputElement;
    $nestedControlEnabled41 = (await screen.findByTestId('select-controlEnabled41')) as HTMLInputElement;
    $nestedControlEnabled42 = (await screen.findByTestId('select-controlEnabled42')) as HTMLInputElement;
    $nestedControlDisabled43 = (await screen.findByTestId('select-controlDisabled43')) as HTMLInputElement;
    $btnControlEnabled1 = await screen.findByTestId('btn-controlEnabled1');
    $btnControlEnabled2 = await screen.findByTestId('btn-controlEnabled2');
    $btnNestedControlEnabled1 = await screen.findByTestId('btn-controlEnabled41');
    $btnNestedControlEnabled2 = await screen.findByTestId('btn-controlEnabled42');
  });

  describe('should set control to disabled when initialized as one', () => {
    it('for top-level control', () => {
      expect($controlDisabled3.disabled).toBe(true);
    });

    it('for nested control', () => {
      expect($nestedControlDisabled43.disabled).toBe(true);
    });
  });

  describe('should set control to enabled when initialized as one', () => {
    describe('for top-level control', () => {
      it('without config object', () => {
        expect($controlEnabled1.disabled).toBe(false);
      });

      it('with config object', () => {
        expect($controlEnabled2.disabled).toBe(false);
      });
    });

    describe('for nested control', () => {
      it('without config object', () => {
        expect($nestedControlEnabled41.disabled).toBe(false);
      });

      it('with config object', () => {
        expect($nestedControlEnabled42.disabled).toBe(false);
      });
    });
  });

  describe('should set control to disabled when programmatically set from outside the form', () => {
    describe('for top-level control', () => {
      it('without config object', () => {
        userEvent.click($btnControlEnabled1);
        expect($controlEnabled1.disabled).toBe(true);
      });

      it('with config object', () => {
        userEvent.click($btnControlEnabled2);
        expect($controlEnabled2.disabled).toBe(true);
      });
    });

    describe('for nested control', () => {
      it('without config object', () => {
        userEvent.click($btnNestedControlEnabled1);
        expect($nestedControlEnabled41.disabled).toBe(true);
      });

      it('with config object', () => {
        userEvent.click($btnNestedControlEnabled2);
        expect($nestedControlEnabled42.disabled).toBe(true);
      });
    });
  });
});

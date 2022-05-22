import { createFormGroup, formGroup, Validators as V } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { Team, TEAMS } from '../utils/get-random-team';
import { For } from 'solid-js';

const INIT_VALUE = '' as Team;
const TEST_VALUE = TEAMS[0] as Team;

const TestApp = () => {
  const fg = createFormGroup({
    value1: INIT_VALUE,
    value2: [INIT_VALUE, { validators: [V.required] }],
    value3: {
      value31: INIT_VALUE,
      value32: [INIT_VALUE, { validators: [V.required] }],
    },
  });
  const [form, setForm] = fg.value;
  const errors = fg.errors;

  return (
    <>
      <p data-testid="errors-value1">{JSON.stringify(errors().value1)}</p>
      <p data-testid="errors-value2">{JSON.stringify(errors().value2)}</p>
      <p data-testid="errors-value31">{JSON.stringify(errors().value3.value31)}</p>
      <p data-testid="errors-value32">{JSON.stringify(errors().value3.value32)}</p>

      <form use:formGroup={fg}>
        <label for="value1">value1</label>
        <select data-testid="select-value1" name="value1" id="value1" formControlName="value1">
          <For each={TEAMS}>
            {(t) => (
              <option data-testid={`value1-${t}`} value={t}>
                {t}
              </option>
            )}
          </For>
        </select>

        <label for="value2">value2</label>
        <select data-testid="select-value2" name="value2" id="value2" formControlName="value2">
          <For each={TEAMS}>
            {(t) => (
              <option data-testid={`value2-${t}`} value={t}>
                {t}
              </option>
            )}
          </For>
        </select>

        <div formGroupName="value3">
          <label for="value31">value31</label>
          <select data-testid="select-value31" name="value31" id="value31" formControlName="value31">
            <For each={TEAMS}>
              {(t) => (
                <option data-testid={`value31-${t}`} value={t}>
                  {t}
                </option>
              )}
            </For>
          </select>

          <label for="value32">value32</label>
          <select data-testid="select-value32" name="value32" id="value32" formControlName="value32">
            <For each={TEAMS}>
              {(t) => (
                <option data-testid={`value32-${t}`} value={t}>
                  {t}
                </option>
              )}
            </For>
          </select>
        </div>
      </form>

      <button data-testid="btn-change-value1" onClick={() => setForm({ ...form(), value1: TEST_VALUE })}>
        Change value1
      </button>
      <button data-testid="btn-change-value2" onClick={() => setForm({ ...form(), value2: TEST_VALUE })}>
        Change value2
      </button>

      <button
        data-testid="btn-change-value31"
        onClick={() => setForm({ ...form(), value3: { ...form().value3, value31: TEST_VALUE } })}
      >
        Change value31
      </button>
      <button
        data-testid="btn-change-value32"
        onClick={() => setForm({ ...form(), value3: { ...form().value3, value32: TEST_VALUE } })}
      >
        Change value32
      </button>
    </>
  );
};

describe('Reading and marking form controls and groups as touched or untouched', () => {
  let $errorsValue1: HTMLElement;
  let $errorsValue2: HTMLElement;
  let $errorsValue31: HTMLElement;
  let $errorsValue32: HTMLElement;
  let $selectValue1: HTMLSelectElement;
  let $selectValue1_productOption: HTMLOptionElement;
  let $selectValue2: HTMLSelectElement;
  let $selectValue2_productOption: HTMLOptionElement;
  let $selectValue31: HTMLSelectElement;
  let $selectValue31_productOption: HTMLOptionElement;
  let $selectValue32: HTMLSelectElement;
  let $selectValue32_productOption: HTMLOptionElement;
  let $btnChangeValue1: HTMLElement;
  let $btnChangeValue2: HTMLElement;
  let $btnChangeValue31: HTMLElement;
  let $btnChangeValue32: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $errorsValue1 = await screen.findByTestId('errors-value1');
    $errorsValue2 = await screen.findByTestId('errors-value2');
    $errorsValue31 = await screen.findByTestId('errors-value31');
    $errorsValue32 = await screen.findByTestId('errors-value32');
    $selectValue1 = (await screen.findByTestId('select-value1')) as HTMLSelectElement;
    $selectValue1_productOption = (await screen.findByTestId('value1-product')) as HTMLOptionElement;
    $selectValue2 = (await screen.findByTestId('select-value2')) as HTMLSelectElement;
    $selectValue2_productOption = (await screen.findByTestId('value2-product')) as HTMLOptionElement;
    $selectValue31 = (await screen.findByTestId('select-value31')) as HTMLSelectElement;
    $selectValue31_productOption = (await screen.findByTestId('value31-product')) as HTMLOptionElement;
    $selectValue32 = (await screen.findByTestId('select-value32')) as HTMLSelectElement;
    $selectValue32_productOption = (await screen.findByTestId('value32-product')) as HTMLOptionElement;
    $btnChangeValue1 = await screen.findByTestId('btn-change-value1');
    $btnChangeValue2 = await screen.findByTestId('btn-change-value2');
    $btnChangeValue31 = await screen.findByTestId('btn-change-value31');
    $btnChangeValue32 = await screen.findByTestId('btn-change-value32');
  });

  describe('should already show validation errors on init', () => {
    describe('for top-level controls', () => {
      it('should show no errors when there is no validators provided in the config', () => {
        const errors = JSON.parse($errorsValue1.innerHTML);

        expect(errors).toBe(null);
      });

      it('should show errors when there is one validator that fails', () => {
        const errors = JSON.parse($errorsValue2.innerHTML);

        expect(errors).not.toBe(null);
        expect(Object.keys(errors)).toContain('required');
      });
    });

    describe('for nested controls', () => {
      it('should show no errors when there is no validators provided in the config', () => {
        const errors = JSON.parse($errorsValue31.innerHTML);

        expect(errors).toBe(null);
      });

      it('should show errors when there is one validator that fails', () => {
        const errors = JSON.parse($errorsValue32.innerHTML);

        expect(errors).not.toBe(null);
        expect(Object.keys(errors)).toContain('required');
      });
    });
  });

  describe('should show no errors when form control values are changed to valid programmatically from outside the form', () => {
    describe('for top-level controls', () => {
      it('value is changed from valid to valid', () => {
        userEvent.click($btnChangeValue1);
        const errors = JSON.parse($errorsValue1.innerHTML);

        expect(errors).toBe(null);
      });

      it('value is changed from invalid to valid when there is one validator', () => {
        userEvent.click($btnChangeValue2);
        const errors = JSON.parse($errorsValue2.innerHTML);

        expect(errors).toBe(null);
      });
    });

    describe('for nested controls', () => {
      it('value is changed from valid to valid', () => {
        userEvent.click($btnChangeValue31);
        const errors = JSON.parse($errorsValue31.innerHTML);

        expect(errors).toBe(null);
      });

      it('value is changed from invalid to valid when there is one validator', () => {
        userEvent.click($btnChangeValue32);
        const errors = JSON.parse($errorsValue32.innerHTML);

        expect(errors).toBe(null);
      });
    });
  });

  describe('should show no errors when form control values are changed to valid from UI', () => {
    describe('for top-level controls', () => {
      it('value is changed from valid to valid', () => {
        userEvent.selectOptions($selectValue1, $selectValue1_productOption);
        const errors = JSON.parse($errorsValue1.innerHTML);

        expect(errors).toBe(null);
      });

      it('value is changed from invalid to valid when there is one validator', () => {
        userEvent.selectOptions($selectValue2, $selectValue2_productOption);
        const errors = JSON.parse($errorsValue2.innerHTML);

        expect(errors).toBe(null);
      });
    });

    describe('for nested controls', () => {
      it('value is changed from valid to valid', () => {
        userEvent.selectOptions($selectValue31, $selectValue31_productOption);
        const errors = JSON.parse($errorsValue31.innerHTML);

        expect(errors).toBe(null);
      });

      it('value is changed from invalid to valid when there is one validator', () => {
        userEvent.selectOptions($selectValue32, $selectValue32_productOption);
        const errors = JSON.parse($errorsValue32.innerHTML);

        expect(errors).toBe(null);
      });
    });
  });
});

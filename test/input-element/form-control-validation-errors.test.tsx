import { createFormGroup, FormControl, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { isNumber } from '../../src/guards';

const INIT_STRING_VALUE = '';
const INIT_NUMBER_VALUE = 0;
const TEST_STRING_VALUE = 'test';
const TEST_NUMBER_VALUE = 10;

const required = (formControl: FormControl) =>
  formControl.value ? null : { required: 'This control is required!' };
const min = (count: number) => (formControl: FormControl) => {
  const value = formControl.value;
  if (isNumber(value)) {
    return value >= count ? null : { min: `Number cannot be less than ${count}!` };
  } else {
    return null;
  }
};

const TestApp = () => {
  const fg = createFormGroup({
    value1: INIT_STRING_VALUE,
    value2: [INIT_STRING_VALUE, { validators: [required] }],
    value3: [INIT_NUMBER_VALUE, { validators: [required, min(5)] }],
    value4: {
      value41: INIT_STRING_VALUE,
      value42: [INIT_STRING_VALUE, { validators: [required] }],
      value43: [INIT_NUMBER_VALUE, { validators: [required, min(5)] }],
    },
  });
  const [form, setForm] = fg.value;
  const errors = fg.errors;

  return (
    <>
      <p data-testid="errors-value1">{JSON.stringify(errors().value1)}</p>
      <p data-testid="errors-value2">{JSON.stringify(errors().value2)}</p>
      <p data-testid="errors-value3">{JSON.stringify(errors().value3)}</p>
      <p data-testid="errors-value41">{JSON.stringify(errors().value4.value41)}</p>
      <p data-testid="errors-value42">{JSON.stringify(errors().value4.value42)}</p>
      <p data-testid="errors-value43">{JSON.stringify(errors().value4.value43)}</p>

      <form use:formGroup={fg}>
        <label for="value1">value1</label>
        <input data-testid="input-value1" id="value1" type="text" formControlName="value1" />

        <label for="value2">value2</label>
        <input data-testid="input-value2" id="value2" type="text" formControlName="value2" />

        <label for="value3">value3</label>
        <input data-testid="input-value3" id="value3" type="number" formControlName="value3" />

        <div formGroupName="value4">
          <label for="value41">value41</label>
          <input data-testid="input-value41" id="value41" type="text" formControlName="value41" />

          <label for="value42">value42</label>
          <input data-testid="input-value42" id="value42" type="text" formControlName="value42" />

          <label for="value43">value43</label>
          <input data-testid="input-value43" id="value43" type="number" formControlName="value43" />
        </div>
      </form>

      <button
        data-testid="btn-change-value1"
        onClick={() => setForm({ ...form(), value1: TEST_STRING_VALUE })}
      >
        Change value1
      </button>
      <button
        data-testid="btn-change-value2"
        onClick={() => setForm({ ...form(), value2: TEST_STRING_VALUE })}
      >
        Change value2
      </button>
      <button
        data-testid="btn-change-value3"
        onClick={() => setForm({ ...form(), value3: TEST_NUMBER_VALUE })}
      >
        Change value3
      </button>

      <button
        data-testid="btn-change-value41"
        onClick={() => setForm({ ...form(), value4: { ...form().value4, value41: TEST_STRING_VALUE } })}
      >
        Change value41
      </button>
      <button
        data-testid="btn-change-value42"
        onClick={() => setForm({ ...form(), value4: { ...form().value4, value42: TEST_STRING_VALUE } })}
      >
        Change value42
      </button>
      <button
        data-testid="btn-change-value43"
        onClick={() => setForm({ ...form(), value4: { ...form().value4, value43: TEST_NUMBER_VALUE } })}
      >
        Change value43
      </button>
    </>
  );
};

describe('Reading and marking form controls and groups as touched or untouched', () => {
  let $errorsValue1: HTMLElement;
  let $errorsValue2: HTMLElement;
  let $errorsValue3: HTMLElement;
  let $errorsValue41: HTMLElement;
  let $errorsValue42: HTMLElement;
  let $errorsValue43: HTMLElement;
  let $inputValue1: HTMLInputElement;
  let $inputValue2: HTMLInputElement;
  let $inputValue3: HTMLInputElement;
  let $inputValue41: HTMLInputElement;
  let $inputValue42: HTMLInputElement;
  let $inputValue43: HTMLInputElement;
  let $btnChangeValue1: HTMLElement;
  let $btnChangeValue2: HTMLElement;
  let $btnChangeValue3: HTMLElement;
  let $btnChangeValue41: HTMLElement;
  let $btnChangeValue42: HTMLElement;
  let $btnChangeValue43: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $errorsValue1 = await screen.findByTestId('errors-value1');
    $errorsValue2 = await screen.findByTestId('errors-value2');
    $errorsValue3 = await screen.findByTestId('errors-value3');
    $errorsValue41 = await screen.findByTestId('errors-value41');
    $errorsValue42 = await screen.findByTestId('errors-value42');
    $errorsValue43 = await screen.findByTestId('errors-value43');
    $inputValue1 = (await screen.findByTestId('input-value1')) as HTMLInputElement;
    $inputValue2 = (await screen.findByTestId('input-value2')) as HTMLInputElement;
    $inputValue3 = (await screen.findByTestId('input-value3')) as HTMLInputElement;
    $inputValue41 = (await screen.findByTestId('input-value41')) as HTMLInputElement;
    $inputValue42 = (await screen.findByTestId('input-value42')) as HTMLInputElement;
    $inputValue43 = (await screen.findByTestId('input-value43')) as HTMLInputElement;
    $btnChangeValue1 = await screen.findByTestId('btn-change-value1');
    $btnChangeValue2 = await screen.findByTestId('btn-change-value2');
    $btnChangeValue3 = await screen.findByTestId('btn-change-value3');
    $btnChangeValue41 = await screen.findByTestId('btn-change-value41');
    $btnChangeValue42 = await screen.findByTestId('btn-change-value42');
    $btnChangeValue43 = await screen.findByTestId('btn-change-value43');
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

      it('should show errors when there are two validators that fail', () => {
        const errors = JSON.parse($errorsValue3.innerHTML);

        expect(errors).not.toBe(null);
        expect(Object.keys(errors)).toContain('required');
        expect(Object.keys(errors)).toContain('min');
      });
    });

    describe('for nested controls', () => {
      it('should show no errors when there is no validators provided in the config', () => {
        const errors = JSON.parse($errorsValue41.innerHTML);

        expect(errors).toBe(null);
      });

      it('should show errors when there is one validator that fails', () => {
        const errors = JSON.parse($errorsValue42.innerHTML);

        expect(errors).not.toBe(null);
        expect(Object.keys(errors)).toContain('required');
      });

      it('should show errors when there are two validators that fail', () => {
        const errors = JSON.parse($errorsValue43.innerHTML);

        expect(errors).not.toBe(null);
        expect(Object.keys(errors)).toContain('required');
        expect(Object.keys(errors)).toContain('min');
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

      it('value is changed from invalid to valid when there are two validators', () => {
        userEvent.click($btnChangeValue3);
        const errors = JSON.parse($errorsValue3.innerHTML);

        expect(errors).toBe(null);
      });
    });

    describe('for nested controls', () => {
      it('value is changed from valid to valid', () => {
        userEvent.click($btnChangeValue41);
        const errors = JSON.parse($errorsValue41.innerHTML);

        expect(errors).toBe(null);
      });

      it('value is changed from invalid to valid when there is one validator', () => {
        userEvent.click($btnChangeValue42);
        const errors = JSON.parse($errorsValue42.innerHTML);

        expect(errors).toBe(null);
      });

      it('value is changed from invalid to valid when there are two validators', () => {
        userEvent.click($btnChangeValue43);
        const errors = JSON.parse($errorsValue43.innerHTML);

        expect(errors).toBe(null);
      });
    });
  });

  describe('should show no errors when form control values are changed to valid from UI', () => {
    describe('for top-level controls', () => {
      it('value is changed from valid to valid', () => {
        userEvent.type($inputValue1, TEST_STRING_VALUE);
        const errors = JSON.parse($errorsValue1.innerHTML);

        expect(errors).toBe(null);
      });

      it('value is changed from invalid to valid when there is one validator', () => {
        userEvent.type($inputValue2, TEST_STRING_VALUE);
        const errors = JSON.parse($errorsValue2.innerHTML);

        expect(errors).toBe(null);
      });

      it('value is changed from invalid to valid when there are two validators', () => {
        userEvent.type($inputValue3, String(TEST_NUMBER_VALUE));
        const errors = JSON.parse($errorsValue3.innerHTML);

        expect(errors).toBe(null);
      });
    });

    describe('for nested controls', () => {
      it('value is changed from valid to valid', () => {
        userEvent.type($inputValue41, TEST_STRING_VALUE);
        const errors = JSON.parse($errorsValue41.innerHTML);

        expect(errors).toBe(null);
      });

      it('value is changed from invalid to valid when there is one validator', () => {
        userEvent.type($inputValue42, TEST_STRING_VALUE);
        const errors = JSON.parse($errorsValue42.innerHTML);

        expect(errors).toBe(null);
      });

      it('value is changed from invalid to valid when there are two validators', () => {
        userEvent.type($inputValue43, String(TEST_NUMBER_VALUE));
        const errors = JSON.parse($errorsValue43.innerHTML);

        expect(errors).toBe(null);
      });
    });
  });
});

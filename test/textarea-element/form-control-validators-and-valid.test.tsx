import { createFormGroup, formGroup, Validators as V } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const INIT_STRING_VALUE = '';
const TEST_STRING_VALUE = 'test';

const TRUE = String(true);
const FALSE = String(false);

const TestApp = () => {
  const fg = createFormGroup({
    value1: INIT_STRING_VALUE,
    value2: [INIT_STRING_VALUE, { validators: [V.required] }],
    value4: {
      value41: INIT_STRING_VALUE,
      value42: [INIT_STRING_VALUE, { validators: [V.required] }],
    },
  });
  const [form, setForm] = fg.value;
  const valid = fg.valid;

  return (
    <>
      <p data-testid="valid-value1">{String(valid().value1)}</p>
      <p data-testid="valid-value2">{String(valid().value2)}</p>
      <p data-testid="valid-value41">{String(valid().value4.value41)}</p>
      <p data-testid="valid-value42">{String(valid().value4.value42)}</p>

      <form use:formGroup={fg}>
        <label for="value1">value1</label>
        <input data-testid="input-value1" id="value1" type="text" formControlName="value1" />

        <label for="value2">value2</label>
        <input data-testid="input-value2" id="value2" type="text" formControlName="value2" />

        <div formGroupName="value4">
          <label for="value41">value41</label>
          <input data-testid="input-value41" id="value41" type="text" formControlName="value41" />

          <label for="value42">value42</label>
          <input data-testid="input-value42" id="value42" type="text" formControlName="value42" />
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
    </>
  );
};

describe('Reading and marking form controls and groups as touched or untouched for `textarea` element', () => {
  let $validValue1: HTMLElement;
  let $validValue2: HTMLElement;
  let $validValue41: HTMLElement;
  let $validValue42: HTMLElement;
  let $inputValue1: HTMLTextAreaElement;
  let $inputValue2: HTMLTextAreaElement;
  let $inputValue41: HTMLTextAreaElement;
  let $inputValue42: HTMLTextAreaElement;
  let $btnChangeValue1: HTMLElement;
  let $btnChangeValue2: HTMLElement;
  let $btnChangeValue41: HTMLElement;
  let $btnChangeValue42: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $validValue1 = await screen.findByTestId('valid-value1');
    $validValue2 = await screen.findByTestId('valid-value2');
    $validValue41 = await screen.findByTestId('valid-value41');
    $validValue42 = await screen.findByTestId('valid-value42');
    $inputValue1 = (await screen.findByTestId('input-value1')) as HTMLTextAreaElement;
    $inputValue2 = (await screen.findByTestId('input-value2')) as HTMLTextAreaElement;
    $inputValue41 = (await screen.findByTestId('input-value41')) as HTMLTextAreaElement;
    $inputValue42 = (await screen.findByTestId('input-value42')) as HTMLTextAreaElement;
    $btnChangeValue1 = await screen.findByTestId('btn-change-value1');
    $btnChangeValue2 = await screen.findByTestId('btn-change-value2');
    $btnChangeValue41 = await screen.findByTestId('btn-change-value41');
    $btnChangeValue42 = await screen.findByTestId('btn-change-value42');
  });

  describe('should already mark form controls as valid/invalid on init', () => {
    describe('for top-level controls', () => {
      it('should mark form control as valid when there is no validators provided in the config', () => {
        expect($validValue1.innerHTML).toBe(TRUE);
      });

      it('should mark form control as invalid when there is one validator that fails', () => {
        expect($validValue2.innerHTML).toBe(FALSE);
      });
    });

    describe('for nested controls', () => {
      it('should mark form control as valid when there is no validators provided in the config', () => {
        expect($validValue41.innerHTML).toBe(TRUE);
      });

      it('should mark form control as invalid when there is one validator that fails', () => {
        expect($validValue42.innerHTML).toBe(FALSE);
      });
    });
  });

  describe('should mark form controls as valid when form control values are changed to valid programmatically from outside the form', () => {
    describe('for top-level controls', () => {
      it('value is changed from valid to valid', () => {
        userEvent.click($btnChangeValue1);

        expect($validValue1.innerHTML).toBe(TRUE);
      });

      it('value is changed from invalid to valid when there is one validator', () => {
        userEvent.click($btnChangeValue2);

        expect($validValue2.innerHTML).toBe(TRUE);
      });
    });

    describe('for nested controls', () => {
      it('value is changed from valid to valid', () => {
        userEvent.click($btnChangeValue41);

        expect($validValue41.innerHTML).toBe(TRUE);
      });

      it('value is changed from invalid to valid when there is one validator', () => {
        userEvent.click($btnChangeValue42);

        expect($validValue42.innerHTML).toBe(TRUE);
      });
    });
  });

  describe('should mark form controls as valid when form control values are changed from UI', () => {
    describe('for top-level controls', () => {
      it('value is changed from valid to valid', () => {
        userEvent.type($inputValue1, TEST_STRING_VALUE);

        expect($validValue1.innerHTML).toBe(TRUE);
      });

      it('value is changed from invalid to valid when there is one validator', () => {
        userEvent.type($inputValue2, TEST_STRING_VALUE);

        expect($validValue2.innerHTML).toBe(TRUE);
      });
    });

    describe('for nested controls', () => {
      it('value is changed from valid to valid', () => {
        userEvent.type($inputValue41, TEST_STRING_VALUE);

        expect($validValue41.innerHTML).toBe(TRUE);
      });

      it('value is changed from invalid to valid when there is one validator', () => {
        userEvent.type($inputValue42, TEST_STRING_VALUE);

        expect($validValue42.innerHTML).toBe(TRUE);
      });
    });
  });
});

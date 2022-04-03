import { createFormGroup, FormControl, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { isNumber } from '../../src/guards';

const INIT_STRING_VALUE = '';
const INIT_NUMBER_VALUE = 0;
const TEST_STRING_VALUE = 'test';
const TEST_NUMBER_VALUE = 10;

const TRUE = String(true);
const FALSE = String(false);

const required = (formControl: FormControl) =>
  formControl.value ? null : { message: 'This control is required!' };
const min = (count: number) => (formControl: FormControl) => {
  const value = formControl.value;
  if (isNumber(value)) {
    return value >= count ? null : { message: `Number cannot be less than ${count}!` };
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
  const validAll = fg.validAll;

  return (
    <>
      <p data-testid="valid-all">{String(validAll())}</p>

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
  let $validAll: HTMLElement;
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

    $validAll = await screen.findByTestId('valid-all');
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

  it('should mark "validAll" as "false" when at least one form control is invalid', function () {
    expect($validAll.innerHTML).toBe(FALSE);
  });

  it('should mark form group as valid when form control values are changed to valid programmatically from outside the form', function () {
    userEvent.click($btnChangeValue2);
    userEvent.click($btnChangeValue3);
    userEvent.click($btnChangeValue42);
    userEvent.click($btnChangeValue43);

    expect($validAll.innerHTML).toBe(TRUE);
  });

  it('should mark form group as valid when form control values are changed from UI to valid ones', function () {
    userEvent.type($inputValue2, TEST_STRING_VALUE);
    userEvent.type($inputValue3, String(TEST_NUMBER_VALUE));
    userEvent.type($inputValue42, TEST_STRING_VALUE);
    userEvent.type($inputValue43, String(TEST_NUMBER_VALUE));

    expect($validAll.innerHTML).toBe(TRUE);
  });
});

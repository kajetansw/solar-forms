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
  const validAll = fg.validAll;

  return (
    <>
      <p data-testid="valid-all">{String(validAll())}</p>

      <form use:formGroup={fg}>
        <label for="value1">value1</label>
        <textarea data-testid="input-value1" name="value1" id="value1" formControlName="value1" />

        <label for="value2">value2</label>
        <textarea data-testid="input-value2" name="value2" id="value2" formControlName="value2" />

        <div formGroupName="value4">
          <label for="value41">value41</label>
          <textarea data-testid="input-value41" name="value41" id="value41" formControlName="value41" />

          <label for="value42">value42</label>
          <textarea data-testid="input-value42" name="value42" id="value42" formControlName="value42" />
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
  let $validAll: HTMLElement;
  let $inputValue2: HTMLTextAreaElement;
  let $inputValue42: HTMLTextAreaElement;
  let $btnChangeValue2: HTMLElement;
  let $btnChangeValue42: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $validAll = await screen.findByTestId('valid-all');
    $inputValue2 = (await screen.findByTestId('input-value2')) as HTMLTextAreaElement;
    $inputValue42 = (await screen.findByTestId('input-value42')) as HTMLTextAreaElement;
    $btnChangeValue2 = await screen.findByTestId('btn-change-value2');
    $btnChangeValue42 = await screen.findByTestId('btn-change-value42');
  });

  it('should mark "validAll" as "false" when at least one form control is invalid', function () {
    expect($validAll.innerHTML).toBe(FALSE);
  });

  it('should mark form group as valid when form control values are changed to valid programmatically from outside the form', function () {
    userEvent.click($btnChangeValue2);
    userEvent.click($btnChangeValue42);

    expect($validAll.innerHTML).toBe(TRUE);
  });

  it('should mark form group as valid when form control values are changed from UI to valid ones', function () {
    userEvent.type($inputValue2, TEST_STRING_VALUE);
    userEvent.type($inputValue42, TEST_STRING_VALUE);

    expect($validAll.innerHTML).toBe(TRUE);
  });
});

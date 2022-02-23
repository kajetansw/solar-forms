import { createFormGroup, formGroup } from '../../src';
import { screen, render, fireEvent } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const INIT_INPUT_VALUE = 0;
const TEST_INPUT_INT_VALUE = 100;
const TEST_INPUT_NUMBER_VALUE = 66.6;

const TestApp = () => {
  const [form, setForm] = createFormGroup({
    age: INIT_INPUT_VALUE,
  });

  return (
    <>
      <p data-testid="value">{form().age}</p>
      <form use:formGroup={[form, setForm]}>
        <label htmlFor="firstName">Age</label>
        <input data-testid="input" id="firstName" type="number" formControlName="age" />
      </form>
      <button data-testid="btn-int" onClick={() => setForm({ age: TEST_INPUT_INT_VALUE })}>
        Change to int
      </button>
      <button data-testid="btn-number" onClick={() => setForm({ age: TEST_INPUT_NUMBER_VALUE })}>
        Change to number
      </button>
    </>
  );
};

describe('Input element with type="number" as form control', () => {
  beforeEach(() => {
    render(() => <TestApp />);
  });

  it('should init value with the one provided in createFormGroup', async () => {
    const $value = await screen.findByTestId('value');

    expect($value.innerHTML).toBe(String(INIT_INPUT_VALUE));
  });

  it('should update form value with int when updating programmatically from outside the form', async () => {
    const $value = await screen.findByTestId('value');
    const buttonEl = await screen.findByTestId('btn-int');

    userEvent.click(buttonEl);

    expect($value.innerHTML).toBe(String(TEST_INPUT_INT_VALUE));
  });

  it('should update form value with number when updating programmatically from outside the form', async () => {
    const $value = await screen.findByTestId('value');
    const $button = await screen.findByTestId('btn-number');

    userEvent.click($button);

    expect($value.innerHTML).toBe(String(TEST_INPUT_NUMBER_VALUE));
  });

  it('should update form value when user types an integer value', async () => {
    const $value = await screen.findByTestId('value');
    const $input = await screen.findByTestId('input');

    fireEvent.change($input, { target: { value: '' } });
    userEvent.type($input, String(TEST_INPUT_INT_VALUE));

    expect($value.innerHTML).toBe(String(TEST_INPUT_INT_VALUE));
  });

  it('should update form value when user types a numeric value', async () => {
    const $value = await screen.findByTestId('value');
    const $input = await screen.findByTestId('input');

    fireEvent.change($input, { target: { value: '' } });
    userEvent.type($input, String(TEST_INPUT_NUMBER_VALUE));

    expect($value.innerHTML).toBe(String(TEST_INPUT_NUMBER_VALUE));
  });

  it('should not update the form value when user types a non-numeric value', async () => {
    const $value = await screen.findByTestId('value');
    const $input = await screen.findByTestId('input');

    fireEvent.change($input, { target: { value: '' } });
    userEvent.type($input, 'aaaaa');

    expect($value.innerHTML).toBe(String(INIT_INPUT_VALUE));
  });
});

import { createFormGroup, formGroup } from '../../../src';
import { screen, render, fireEvent } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const INIT_INPUT_VALUE = 0;
const TEST_INPUT_INT_VALUE = 100;
const TEST_INPUT_NUMBER_VALUE = 66.6;
const NULL = String(null);

const TestApp = () => {
  const fg = createFormGroup({
    age: INIT_INPUT_VALUE as number | null,
    ageNull: null,
  });
  const [form, setForm] = fg.value;

  return (
    <>
      <p data-testid="value">{form().age}</p>
      <p data-testid="value-null">{String(form().ageNull)}</p>
      <form use:formGroup={fg}>
        <label for="age">Age</label>
        <input data-testid="input" id="age" type="number" formControlName="age" />
        <label for="ageNull">Age null</label>
        <input data-testid="input-null" id="ageNull" type="number" formControlName="ageNull" />
      </form>
      <button data-testid="btn-int" onClick={() => setForm({ ...form(), age: TEST_INPUT_INT_VALUE })}>
        Change to int
      </button>
      <button data-testid="btn-number" onClick={() => setForm({ ...form(), age: TEST_INPUT_NUMBER_VALUE })}>
        Change to number
      </button>
      <button data-testid="btn-null" onClick={() => setForm({ ...form(), age: null })}>
        Change to null
      </button>
    </>
  );
};

describe('Input element with type="number" as form control', () => {
  let $valueNumber: HTMLElement;
  let $valueNull: HTMLElement;
  let $inputWithNumber: HTMLInputElement;
  let $inputWithNull: HTMLInputElement;
  let $changeToIntButton: HTMLElement;
  let $changeToNumberButton: HTMLElement;
  let $changeToNullButton: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueNumber = await screen.findByTestId('value');
    $valueNull = await screen.findByTestId('value-null');
    $inputWithNumber = (await screen.findByTestId('input')) as HTMLInputElement;
    $inputWithNull = (await screen.findByTestId('input-null')) as HTMLInputElement;
    $changeToNumberButton = await screen.findByTestId('btn-number');
    $changeToIntButton = await screen.findByTestId('btn-int');
    $changeToNullButton = await screen.findByTestId('btn-null');
  });

  describe('should init value with the one provided in createFormGroup', () => {
    it('when value is number', async () => {
      expect($valueNumber.innerHTML).toBe(String(INIT_INPUT_VALUE));
      expect($inputWithNumber.valueAsNumber).toBe(INIT_INPUT_VALUE);
    });

    it('when value is null', async () => {
      expect($valueNull.innerHTML).toBe(NULL);
      expect($inputWithNull.value).toBe('');
    });
  });

  describe('should update form value when updating programmatically from outside the form', () => {
    it('with number', async () => {
      userEvent.click($changeToNumberButton);

      expect($valueNumber.innerHTML).toBe(String(TEST_INPUT_NUMBER_VALUE));
      expect($inputWithNumber.valueAsNumber).toBe(TEST_INPUT_NUMBER_VALUE);
    });

    it('with int', async () => {
      userEvent.click($changeToIntButton);

      expect($valueNumber.innerHTML).toBe(String(TEST_INPUT_INT_VALUE));
      expect($inputWithNumber.valueAsNumber).toBe(TEST_INPUT_INT_VALUE);
    });

    it('with null', async () => {
      userEvent.click($changeToNullButton);

      expect($valueNumber.innerHTML === NULL || $valueNumber.innerHTML === '').toBeTruthy();
      expect($inputWithNumber.value).toBe('');
    });
  });

  describe('should update form value when user types ', () => {
    it('an integer value', async () => {
      fireEvent.change($inputWithNumber, { target: { value: '' } });
      userEvent.type($inputWithNumber, String(TEST_INPUT_INT_VALUE));

      expect($valueNumber.innerHTML).toBe(String(TEST_INPUT_INT_VALUE));
    });

    it('an numeric value', async () => {
      fireEvent.change($inputWithNumber, { target: { value: '' } });
      userEvent.type($inputWithNumber, String(TEST_INPUT_NUMBER_VALUE));

      expect($valueNumber.innerHTML).toBe(String(TEST_INPUT_NUMBER_VALUE));
    });
  });

  it('should not update the form value when user types a non-numeric value', async () => {
    const $value = await screen.findByTestId('value');
    const $input = await screen.findByTestId('input');

    fireEvent.change($input, { target: { value: '' } });
    userEvent.type($input, 'aaaaa');

    expect($value.innerHTML).toBe(String(INIT_INPUT_VALUE));
  });
});

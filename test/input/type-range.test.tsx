import { createFormGroup, formGroup } from '../../src';
import { screen, render, fireEvent } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const INIT_INPUT_VALUE = 10;
const TEST_INPUT_INT_VALUE = 66;
const NULL = String(null);

const TestApp = () => {
  const fg = createFormGroup({
    valueNumber: INIT_INPUT_VALUE as number | null,
    valueNull: null,
  });
  const [form, setForm] = fg.value;

  return (
    <>
      <p data-testid="value">{form().valueNumber}</p>
      <p data-testid="value-null">{String(form().valueNull)}</p>
      <form use:formGroup={fg}>
        <label for="valueNumber">valueNumber</label>
        <input data-testid="input" id="valueNumber" type="range" formControlName="valueNumber" />
        <label for="valueNull">valueNull</label>
        <input data-testid="input-null" id="valueNull" type="range" formControlName="valueNull" />
      </form>
      <button data-testid="btn" onClick={() => setForm({ ...form(), valueNumber: TEST_INPUT_INT_VALUE })}>
        Change valueNumber
      </button>
      <button data-testid="btn-null" onClick={() => setForm({ ...form(), valueNumber: null })}>
        Change valueNumber to null
      </button>
    </>
  );
};

describe('Input element with type="range" as form control', () => {
  let $valueNumber: HTMLElement;
  let $valueNull: HTMLElement;
  let $inputWithNumber: HTMLInputElement;
  let $changeToNumberButton: HTMLElement;
  let $changeToNullButton: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueNumber = await screen.findByTestId('value');
    $valueNull = await screen.findByTestId('value-null');
    $inputWithNumber = (await screen.findByTestId('input')) as HTMLInputElement;
    $changeToNumberButton = await screen.findByTestId('btn');
    $changeToNullButton = await screen.findByTestId('btn-null');
  });

  describe('should init value with the one provided in createFormGroup', () => {
    it('when value is number', async () => {
      expect($valueNumber.innerHTML).toBe(String(INIT_INPUT_VALUE));
    });

    it('when value is null', async () => {
      expect($valueNull.innerHTML).toBe(NULL);
    });
  });

  describe('should update form value with int when updating programmatically from outside the form', () => {
    it('with number', async () => {
      userEvent.click($changeToNumberButton);

      expect($valueNumber.innerHTML).toBe(String(TEST_INPUT_INT_VALUE));
    });

    it('with null', async () => {
      userEvent.click($changeToNullButton);

      expect($valueNumber.innerHTML === NULL || $valueNumber.innerHTML === '').toBeTruthy();
    });
  });

  it('should update form value when user selects a value', async () => {
    const testValue = Math.floor(Math.random() * 100);

    fireEvent.input($inputWithNumber, { target: { value: testValue } });

    expect($valueNumber.innerHTML).toBe(String(testValue));
  });
});

import { createFormGroup, formGroup } from '../../src';
import { screen, render, fireEvent } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { getRandomTimeString } from '../utils/get-random-date';

const INIT_INPUT_VALUE = getRandomTimeString();
const TEST_INPUT_VALUE = getRandomTimeString();
const NULL = String(null);

const TestApp = () => {
  const fg = createFormGroup({
    valueString: INIT_INPUT_VALUE as string | null,
    valueNull: null,
  });
  const [form, setForm] = fg.value;

  return (
    <>
      <p data-testid="value">{form().valueString}</p>
      <p data-testid="value-null">{String(form().valueNull)}</p>
      <form use:formGroup={fg}>
        <label for="valueString">valueString</label>
        <input data-testid="input" id="valueString" type="time" formControlName="valueString" />
        <label for="valueNull">valueNull</label>
        <input data-testid="input-null" id="valueNull" type="time" formControlName="valueNull" />
      </form>
      <button data-testid="btn" onClick={() => setForm({ ...form(), valueString: TEST_INPUT_VALUE })}>
        Change valueString
      </button>
      <button data-testid="btn-null" onClick={() => setForm({ ...form(), valueString: null })}>
        Change valueString to null
      </button>
    </>
  );
};

describe('Input element with type="time" as form control', () => {
  let $valueString: HTMLElement;
  let $valueNull: HTMLElement;
  let $inputWithString: HTMLInputElement;
  let $changeToStringButton: HTMLElement;
  let $changeToNullButton: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueString = await screen.findByTestId('value');
    $valueNull = await screen.findByTestId('value-null');
    $inputWithString = (await screen.findByTestId('input')) as HTMLInputElement;
    $changeToStringButton = await screen.findByTestId('btn');
    $changeToNullButton = await screen.findByTestId('btn-null');
  });

  describe('should init value with the one provided in createFormGroup', () => {
    it('when value is string', async () => {
      expect($valueString.innerHTML).toBe(INIT_INPUT_VALUE);
    });

    it('when value is null', async () => {
      expect($valueNull.innerHTML).toBe(NULL);
    });
  });

  describe('should update form value when updating programmatically from outside the form', () => {
    it('with string', async () => {
      userEvent.click($changeToStringButton);

      expect($valueString.innerHTML).toBe(TEST_INPUT_VALUE);
    });

    it('with null', async () => {
      userEvent.click($changeToNullButton);

      expect($valueString.innerHTML === NULL || $valueString.innerHTML === '').toBeTruthy();
    });
  });

  it('should update form value when on manual input', async () => {
    fireEvent.change($inputWithString, { target: { value: '' } });
    userEvent.type($inputWithString, TEST_INPUT_VALUE);

    expect($valueString.innerHTML).toBe(TEST_INPUT_VALUE);
  });
});

import { createFormGroup, formGroup } from '../../../src';
import { screen, render, fireEvent } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { getRandomTimeDate, getRandomTimeNumber, getRandomTimeString } from '../../utils/get-random-date';

const INIT_INPUT_STRING_VALUE = getRandomTimeString();
const INIT_INPUT_NUMBER_VALUE = getRandomTimeNumber();
const INIT_INPUT_DATE_VALUE = getRandomTimeDate();
const TEST_INPUT_STRING_VALUE = getRandomTimeString();
const TEST_INPUT_NUMBER_VALUE = getRandomTimeNumber();
const TEST_INPUT_DATE_VALUE = getRandomTimeDate();
const NULL = String(null);

const TestApp = () => {
  const fg = createFormGroup({
    valueString: INIT_INPUT_STRING_VALUE as string | null,
    valueNumber: INIT_INPUT_NUMBER_VALUE as number | null,
    valueDate: INIT_INPUT_DATE_VALUE as Date | null,
    valueNull: null,
  });
  const [form, setForm] = fg.value;

  const printDate = (date: Date | null) => {
    return date ? date.toISOString() : NULL;
  };

  return (
    <>
      <p data-testid="value-string">{form().valueString}</p>
      <p data-testid="value-number">{String(form().valueNumber)}</p>
      <p data-testid="value-date">{printDate(form().valueDate)}</p>
      <p data-testid="value-null">{String(form().valueNull)}</p>

      <form use:formGroup={fg}>
        <label for="valueString">valueString</label>
        <input
          data-testid="input-string"
          id="valueString"
          step="1"
          type="time"
          formControlName="valueString"
        />
        <label for="valueNumber">valueNumber</label>
        <input
          data-testid="input-number"
          id="valueNumber"
          step="1"
          type="time"
          formControlName="valueNumber"
        />
        <label for="valueDate">valueDate</label>
        <input data-testid="input-date" id="valueDate" step="1" type="time" formControlName="valueDate" />
        <label for="valueNull">valueNull</label>
        <input data-testid="input-null" id="valueNull" step="1" type="time" formControlName="valueNull" />
      </form>

      <button
        data-testid="btn-string"
        onClick={() => setForm({ ...form(), valueString: TEST_INPUT_STRING_VALUE })}
      >
        Change valueString
      </button>
      <button
        data-testid="btn-number"
        onClick={() => setForm({ ...form(), valueNumber: TEST_INPUT_NUMBER_VALUE })}
      >
        Change valueNumber
      </button>
      <button data-testid="btn-date" onClick={() => setForm({ ...form(), valueDate: TEST_INPUT_DATE_VALUE })}>
        Change valueDate
      </button>
      <button data-testid="btn-null" onClick={() => setForm({ ...form(), valueString: null })}>
        Change valueString to null
      </button>
    </>
  );
};

describe('Input element with type="time" as form control', () => {
  let $valueString: HTMLElement;
  let $valueNumber: HTMLElement;
  let $valueDate: HTMLElement;
  let $valueNull: HTMLElement;
  let $inputWithString: HTMLInputElement;
  let $changeToStringButton: HTMLElement;
  let $changeToNumberButton: HTMLElement;
  let $changeToDateButton: HTMLElement;
  let $changeToNullButton: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueString = await screen.findByTestId('value-string');
    $valueNumber = await screen.findByTestId('value-number');
    $valueDate = await screen.findByTestId('value-date');
    $valueNull = await screen.findByTestId('value-null');
    $inputWithString = (await screen.findByTestId('input-string')) as HTMLInputElement;
    $changeToStringButton = await screen.findByTestId('btn-string');
    $changeToNumberButton = await screen.findByTestId('btn-number');
    $changeToDateButton = await screen.findByTestId('btn-date');
    $changeToNullButton = await screen.findByTestId('btn-null');
  });

  describe('should init value with the one provided in createFormGroup', () => {
    it('when value is string', async () => {
      expect($valueString.innerHTML).toBe(INIT_INPUT_STRING_VALUE);
    });

    it('when value is number', async () => {
      expect($valueNumber.innerHTML).toBe(String(INIT_INPUT_NUMBER_VALUE));
    });

    it('when value is Date', async () => {
      expect($valueDate.innerHTML).toBe(INIT_INPUT_DATE_VALUE.toISOString());
    });

    it('when value is null', async () => {
      expect($valueNull.innerHTML).toBe(NULL);
    });
  });

  describe('should update form value when updating programmatically from outside the form', () => {
    it('with string', async () => {
      userEvent.click($changeToStringButton);

      expect($valueString.innerHTML).toBe(TEST_INPUT_STRING_VALUE);
    });

    it('with number', async () => {
      userEvent.click($changeToNumberButton);

      expect($valueNumber.innerHTML).toBe(String(TEST_INPUT_NUMBER_VALUE));
    });

    it('with Date', async () => {
      userEvent.click($changeToDateButton);

      expect($valueDate.innerHTML).toBe(TEST_INPUT_DATE_VALUE.toISOString());
    });

    it('with null', async () => {
      userEvent.click($changeToNullButton);

      expect($valueString.innerHTML === NULL || $valueString.innerHTML === '').toBeTruthy();
    });
  });

  it('should update form value when on manual input', async () => {
    fireEvent.change($inputWithString, { target: { value: '' } });
    userEvent.type($inputWithString, TEST_INPUT_STRING_VALUE);

    expect($valueString.innerHTML).toBe(TEST_INPUT_STRING_VALUE);
  });
});

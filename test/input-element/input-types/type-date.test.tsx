import { createFormGroup, formGroup } from '../../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { getRandomDate } from '../../utils/get-random-date';
import { fireInputEvent } from '../../utils/fire-event-helpers';
import { toISODate } from '../../utils/date-format';

const INIT_INPUT_DATE_VALUE = getRandomDate();
const TEST_INPUT_DATE_VALUE = getRandomDate();
const INIT_INPUT_STRING_VALUE = toISODate(getRandomDate());
const TEST_INPUT_STRING_VALUE = toISODate(getRandomDate());
const INIT_INPUT_NUMBER_VALUE = getRandomDate().getTime();
const TEST_INPUT_NUMBER_VALUE = getRandomDate().getTime();

const TestApp = () => {
  const fg = createFormGroup({
    valueDate: INIT_INPUT_DATE_VALUE,
    valueString: INIT_INPUT_STRING_VALUE,
    valueNumber: INIT_INPUT_NUMBER_VALUE,
  });
  const [form, setForm] = fg.value;
  const printDate = (date: Date) => (date === null ? 'null' : date.toDateString());

  return (
    <>
      <p data-testid="value-date">{printDate(form().valueDate)}</p>
      <p data-testid="value-string">{form().valueString}</p>
      <p data-testid="value-number">{form().valueNumber}</p>

      <form use:formGroup={fg}>
        <label for="valueDate">valueDate</label>
        <input data-testid="input-date" id="valueDate" type="date" formControlName="valueDate" />

        <label for="valueString">valueString</label>
        <input data-testid="input-string" id="valueString" type="date" formControlName="valueString" />

        <label for="valueNumber">valueNumber</label>
        <input data-testid="input-number" id="valueNumber" type="date" formControlName="valueNumber" />
      </form>

      <button data-testid="btn-date" onClick={() => setForm({ ...form(), valueDate: TEST_INPUT_DATE_VALUE })}>
        Change valueDate
      </button>
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
    </>
  );
};

describe('Input element with type="date" as form control', () => {
  let $valueDate: HTMLElement;
  let $valueString: HTMLElement;
  let $valueNumber: HTMLElement;
  let $inputWithDate: HTMLInputElement;
  let $inputWithString: HTMLInputElement;
  let $inputWithNumber: HTMLInputElement;
  let $changeToDateButton: HTMLElement;
  let $changeToStringButton: HTMLElement;
  let $changeToNumberButton: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueDate = await screen.findByTestId('value-date');
    $valueString = await screen.findByTestId('value-string');
    $valueNumber = await screen.findByTestId('value-number');
    $inputWithDate = (await screen.findByTestId('input-date')) as HTMLInputElement;
    $inputWithString = (await screen.findByTestId('input-string')) as HTMLInputElement;
    $inputWithNumber = (await screen.findByTestId('input-number')) as HTMLInputElement;
    $changeToDateButton = await screen.findByTestId('btn-date');
    $changeToStringButton = await screen.findByTestId('btn-string');
    $changeToNumberButton = await screen.findByTestId('btn-number');
  });

  describe('should init value with the one provided in createFormGroup', () => {
    it('when value is Date', async () => {
      expect($valueDate.innerHTML).toBe(INIT_INPUT_DATE_VALUE.toDateString());
      expect($inputWithDate.value).toBe(toISODate(INIT_INPUT_DATE_VALUE));
    });

    it('when value is string', async () => {
      expect($valueString.innerHTML).toBe(INIT_INPUT_STRING_VALUE);
      expect($inputWithString.value).toBe(INIT_INPUT_STRING_VALUE);
    });

    it('when value is number', async () => {
      expect($valueNumber.innerHTML).toBe(String(INIT_INPUT_NUMBER_VALUE));
      expect($inputWithNumber.valueAsNumber).toBe(INIT_INPUT_NUMBER_VALUE);
    });
  });

  describe('should update form value when updating programmatically from outside the form', () => {
    it('with Date', async () => {
      userEvent.click($changeToDateButton);

      expect($valueDate.innerHTML).toBe(TEST_INPUT_DATE_VALUE.toDateString());
      expect($inputWithDate.value).toBe(toISODate(TEST_INPUT_DATE_VALUE));
    });

    it('with string', async () => {
      userEvent.click($changeToStringButton);

      expect($valueString.innerHTML).toBe(TEST_INPUT_STRING_VALUE);
      expect($inputWithString.value).toBe(TEST_INPUT_STRING_VALUE);
    });

    it('with number', async () => {
      userEvent.click($changeToNumberButton);

      expect($valueNumber.innerHTML).toBe(String(TEST_INPUT_NUMBER_VALUE));
      expect($inputWithNumber.valueAsNumber).toBe(TEST_INPUT_NUMBER_VALUE);
    });
  });

  describe('should update form value when on manual input', () => {
    it('when initial value was Date', async () => {
      const testValueString = toISODate(TEST_INPUT_DATE_VALUE);

      fireInputEvent($inputWithDate as HTMLInputElement, testValueString);

      expect($valueDate.innerHTML).toBe(TEST_INPUT_DATE_VALUE.toDateString());
      expect($inputWithDate.value).toBe(testValueString);
    });

    it('when initial value was string', async () => {
      fireInputEvent($inputWithString as HTMLInputElement, TEST_INPUT_STRING_VALUE);

      expect($valueString.innerHTML).toBe(TEST_INPUT_STRING_VALUE);
      expect($inputWithString.value).toBe(TEST_INPUT_STRING_VALUE);
    });

    it('when initial value was number', async () => {
      fireInputEvent($inputWithNumber as HTMLInputElement, TEST_INPUT_NUMBER_VALUE);

      expect($valueNumber.innerHTML).toBe(String(TEST_INPUT_NUMBER_VALUE));
      expect($inputWithNumber.valueAsNumber).toBe(TEST_INPUT_NUMBER_VALUE);
    });
  });

  /* 
    TODO this does not work because `jest@^27.5.1` id dependent on an old `jest-environment-jsdom` package 
    that is dependent on an old `jsdom` package that contains a bug: 
    https://github.com/jsdom/jsdom/pull/3274
  */
  // it('should accept null value (when date provided by user has invalid format)', async () => {
  //   const $value = await screen.findByTestId('value');
  //   const $input = await screen.findByTestId('input');
  //
  //   fireDateInputEvent($input as HTMLInputElement, '00');
  //
  //   expect($value.innerHTML).toBe('null');
  // });
});

import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { getRandomDateTime } from '../utils/get-random-date';
import { toDateTimeString } from '../utils/to-datetime-string';
import { fireInputEvent } from '../utils/fire-event-helpers';

const INIT_INPUT_STRING_VALUE = toDateTimeString(getRandomDateTime());
const TEST_INPUT_STRING_VALUE = toDateTimeString(getRandomDateTime());
const INIT_INPUT_NUMBER_VALUE = getRandomDateTime().getTime();
const TEST_INPUT_NUMBER_VALUE = getRandomDateTime().getTime();
const NULL = String(null);

const TestApp = () => {
  const [form, setForm] = createFormGroup({
    dateTimeString: INIT_INPUT_STRING_VALUE as null | string,
    dateTimeNumber: INIT_INPUT_NUMBER_VALUE as null | number,
    dateTimeNull: null,
  });

  return (
    <>
      <p data-testid="value-string">{form().dateTimeString}</p>
      <p data-testid="value-number">{form().dateTimeNumber}</p>
      <p data-testid="value-null">{String(form().dateTimeNull)}</p>
      <form use:formGroup={[form, setForm]}>
        <label for="dateTimeString">Date time string</label>
        <input
          data-testid="input-string"
          id="dateTimeString"
          type="datetime-local"
          formControlName="dateTimeString"
          step="1"
        />
        <label for="dateTimeNumber">Date time number</label>
        <input
          data-testid="input-number"
          id="dateTimeNumber"
          type="datetime-local"
          formControlName="dateTimeNumber"
          step="1"
        />
        <label for="dateTimeNull">Date time null</label>
        <input
          data-testid="input-null"
          id="dateTimeNull"
          type="datetime-local"
          formControlName="dateTimeNull"
          step="1"
        />
      </form>
      <button
        data-testid="btn-string"
        onClick={() => setForm((s) => ({ ...s, dateTimeString: TEST_INPUT_STRING_VALUE }))}
      >
        Change string value
      </button>
      <button
        data-testid="btn-number"
        onClick={() => setForm((s) => ({ ...s, dateTimeNumber: TEST_INPUT_NUMBER_VALUE }))}
      >
        Change number value
      </button>
      <button data-testid="btn-string-null" onClick={() => setForm((s) => ({ ...s, dateTimeString: null }))}>
        Change string value to null
      </button>
      <button data-testid="btn-number-null" onClick={() => setForm((s) => ({ ...s, dateTimeNumber: null }))}>
        Change number value to null
      </button>
    </>
  );
};

describe('Input element with type="datetime-local" as form control', () => {
  let $valueString: HTMLElement;
  let $valueNumber: HTMLElement;
  let $valueNull: HTMLElement;
  let $inputWithString: HTMLInputElement;
  let $inputWithNumber: HTMLInputElement;
  let $inputWithNull: HTMLInputElement;
  let $changeToStringButton: HTMLElement;
  let $changeToNumberButton: HTMLElement;
  let $changeStringToNullButton: HTMLElement;
  let $changeNumberToNullButton: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueString = await screen.findByTestId('value-string');
    $valueNumber = await screen.findByTestId('value-number');
    $valueNull = await screen.findByTestId('value-null');
    $inputWithString = (await screen.findByTestId('input-string')) as HTMLInputElement;
    $inputWithNumber = (await screen.findByTestId('input-number')) as HTMLInputElement;
    $inputWithNull = (await screen.findByTestId('input-null')) as HTMLInputElement;
    $changeToStringButton = await screen.findByTestId('btn-string');
    $changeToNumberButton = await screen.findByTestId('btn-number');
    $changeStringToNullButton = await screen.findByTestId('btn-string-null');
    $changeNumberToNullButton = await screen.findByTestId('btn-number-null');
  });

  describe('DateTime as string', () => {
    describe('should init value with the one provided in createFormGroup', () => {
      it('when value is Date in string format', async () => {
        expect($valueString.innerHTML).toBe(INIT_INPUT_STRING_VALUE);
        expect($inputWithString.value).toContain(INIT_INPUT_STRING_VALUE);
      });

      it('when value is null', async () => {
        expect($valueNull.innerHTML).toBe(NULL);
        expect($inputWithNull.value).toBe('');
      });
    });

    describe('should update form value when updating programmatically from outside the form', () => {
      it('with string', async () => {
        userEvent.click($changeToStringButton);

        expect($valueString.innerHTML).toBe(TEST_INPUT_STRING_VALUE);
        expect($inputWithString.value).toContain(TEST_INPUT_STRING_VALUE);
      });

      it('with null', async () => {
        userEvent.click($changeStringToNullButton);

        expect($valueString.innerHTML === NULL || $valueString.innerHTML === '').toBeTruthy();
        expect($inputWithString.value).toBe('');
      });
    });

    it('should update form value when on manual input', async () => {
      fireInputEvent($inputWithString, TEST_INPUT_STRING_VALUE);

      expect($valueString.innerHTML).toContain(TEST_INPUT_STRING_VALUE);
      expect($inputWithString.value).toContain(TEST_INPUT_STRING_VALUE);
    });
  });

  describe('DateTime as number', () => {
    it('should init value with the one provided in createFormGroup when value is Date in number format', async () => {
      expect($valueNumber.innerHTML).toBe(String(INIT_INPUT_NUMBER_VALUE));
      expect($inputWithNumber.valueAsNumber).toBe(INIT_INPUT_NUMBER_VALUE);
    });

    describe('should update form value when updating programmatically from outside the form', () => {
      it('with number', async () => {
        userEvent.click($changeToNumberButton);

        expect($valueNumber.innerHTML).toBe(String(TEST_INPUT_NUMBER_VALUE));
        expect($inputWithNumber.valueAsNumber).toBe(TEST_INPUT_NUMBER_VALUE);
      });

      it('with null', async () => {
        userEvent.click($changeNumberToNullButton);

        expect($valueNumber.innerHTML === NULL || $valueNumber.innerHTML === '').toBeTruthy();
        expect($inputWithNumber.value).toBe('');
      });
    });

    it('should update form value when on manual input', async () => {
      fireInputEvent($inputWithNumber, TEST_INPUT_NUMBER_VALUE);

      expect($valueNumber.innerHTML).toBe(String(TEST_INPUT_NUMBER_VALUE));
      expect($inputWithNumber.valueAsNumber).toBe(TEST_INPUT_NUMBER_VALUE);
    });
  });
});

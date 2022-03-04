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

const TestApp = () => {
  const [form, setForm] = createFormGroup({
    dateTimeString: INIT_INPUT_STRING_VALUE,
    dateTimeNumber: INIT_INPUT_NUMBER_VALUE,
  });

  return (
    <>
      <p data-testid="value-string">{form().dateTimeString}</p>
      <p data-testid="value-number">{form().dateTimeNumber}</p>
      <form use:formGroup={[form, setForm]}>
        <label for="dateTimeString">Date time string</label>
        <input
          data-testid="input-string"
          id="dateTimeString"
          type="datetime-local"
          formControlName="dateTimeString"
        />
        <label for="dateTimeNumber">Date time number</label>
        <input
          data-testid="input-number"
          id="dateTimeNumber"
          type="datetime-local"
          formControlName="dateTimeNumber"
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
    </>
  );
};

describe('Input element with type="datetime-local" as form control', () => {
  beforeEach(() => {
    render(() => <TestApp />);
  });

  describe('DateTime as string', () => {
    it('should init value with the one provided in createFormGroup', async () => {
      const $value = await screen.findByTestId('value-string');

      expect($value.innerHTML).toBe(INIT_INPUT_STRING_VALUE);
    });

    it('should update form value when updating programmatically from outside the form', async () => {
      const $value = await screen.findByTestId('value-string');
      const $button = await screen.findByTestId('btn-string');

      userEvent.click($button);

      expect($value.innerHTML).toBe(TEST_INPUT_STRING_VALUE);
    });

    it('should update form value when on manual input', async () => {
      const $value = await screen.findByTestId('value-string');
      const $input = await screen.findByTestId('input-string');

      fireInputEvent($input, TEST_INPUT_STRING_VALUE);

      expect($value.innerHTML).toContain(TEST_INPUT_STRING_VALUE);
    });
  });

  describe('DateTime as number', () => {
    it('should init value with the one provided in createFormGroup', async () => {
      const $value = await screen.findByTestId('value-number');

      expect($value.innerHTML).toBe(String(INIT_INPUT_NUMBER_VALUE));
    });

    it('should update form value when updating programmatically from outside the form', async () => {
      const $value = await screen.findByTestId('value-number');
      const $button = await screen.findByTestId('btn-number');

      userEvent.click($button);

      expect($value.innerHTML).toBe(String(TEST_INPUT_NUMBER_VALUE));
    });

    it('should update form value when on manual input', async () => {
      const $value = await screen.findByTestId('value-number');
      const $input = await screen.findByTestId('input-number');

      fireInputEvent($input, TEST_INPUT_NUMBER_VALUE);

      expect($value.innerHTML).toBe(String(TEST_INPUT_NUMBER_VALUE));
    });
  });
});

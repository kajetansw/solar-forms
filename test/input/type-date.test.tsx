import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { getRandomDate } from '../utils/get-random-date';
import { fireDateInputEvent } from '../utils/fire-event-helpers';
import { toISODateString } from '../utils/date-format';

const INIT_INPUT_VALUE = getRandomDate();
const TEST_INPUT_VALUE = getRandomDate();

const TestApp = () => {
  const [form, setForm] = createFormGroup({
    birthDay: INIT_INPUT_VALUE,
  });
  const printDate = (date: Date) => (date === null ? 'null' : date.toDateString());

  return (
    <>
      <p data-testid="value">{printDate(form().birthDay)}</p>
      <form use:formGroup={[form, setForm]}>
        <label for="birthDay">First name</label>
        <input data-testid="input" id="birthDay" type="date" formControlName="birthDay" />
      </form>
      <button data-testid="btn" onClick={() => setForm({ birthDay: TEST_INPUT_VALUE })}>
        Change
      </button>
    </>
  );
};

describe('Input element with type="date" as form control', () => {
  beforeEach(() => {
    render(() => <TestApp />);
  });

  it('should init value with the one provided in createFormGroup', async () => {
    const $value = await screen.findByTestId('value');

    expect($value.innerHTML).toBe(INIT_INPUT_VALUE.toDateString());
  });

  it('should update form value when updating programmatically from outside the form', async () => {
    const $value = await screen.findByTestId('value');
    const $button = await screen.findByTestId('btn');

    userEvent.click($button);

    expect($value.innerHTML).toBe(TEST_INPUT_VALUE.toDateString());
  });

  it('should update form value when on manual input', async () => {
    const $value = await screen.findByTestId('value');
    const $input = await screen.findByTestId('input');
    const testValueString = toISODateString(TEST_INPUT_VALUE);

    fireDateInputEvent($input as HTMLInputElement, testValueString);

    expect($value.innerHTML).toBe(TEST_INPUT_VALUE.toDateString());
  });

  // TODO make this work
  // it('should accept null value (when date provided by user has invalid format)', async () => {
  //   const $value = await screen.findByTestId('value');
  //   const $input = await screen.findByTestId('input');
  //
  //   fireDateInputEvent($input as HTMLInputElement, '0000-00-00');
  //
  //   expect($value.innerHTML).toBe('null');
  // });
});

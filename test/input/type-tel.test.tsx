import { createFormGroup, formGroup } from '../../src/lib';
import { screen, render, fireEvent } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const INIT_INPUT_VALUE = '+12345';
const TEST_INPUT_VALUE = '+67890';

const TestApp = () => {
  const [form, setForm] = createFormGroup({
    phoneNumber: INIT_INPUT_VALUE,
  });

  return (
    <>
      <p data-testid="value">{form().phoneNumber}</p>
      <form use:formGroup={[form, setForm]}>
        <label htmlFor="phoneNumber">First name</label>
        <input data-testid="input" id="phoneNumber" type="tel" formControlName="phoneNumber" />
      </form>
      <button data-testid="btn" onClick={() => setForm({ phoneNumber: TEST_INPUT_VALUE })}>
        Change
      </button>
    </>
  );
};

describe('Input element with type="tel" as form control', () => {
  beforeEach(() => {
    render(() => <TestApp />);
  });

  it('should init value with the one provided in createFormGroup', async () => {
    const $value = await screen.findByTestId('value');

    expect($value.innerHTML).toBe(INIT_INPUT_VALUE);
  });

  it('should update form value when updating programmatically from outside the form', async () => {
    const $value = await screen.findByTestId('value');
    const $button = await screen.findByTestId('btn');

    userEvent.click($button);

    expect($value.innerHTML).toBe(TEST_INPUT_VALUE);
  });

  it('should update form value when on manual input', async () => {
    const $value = await screen.findByTestId('value');
    const $input = await screen.findByTestId('input');

    fireEvent.change($input, { target: { value: '' } });
    userEvent.type($input, TEST_INPUT_VALUE);

    expect($value.innerHTML).toBe(TEST_INPUT_VALUE);
  });
});

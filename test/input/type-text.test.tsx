import { createFormGroup, formGroup } from '../../src/lib';
import { screen, render, fireEvent } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const INIT_INPUT_VALUE = 'Thomas';
const TEST_INPUT_VALUE = 'test';

const TestApp = () => {
  const [form, setForm] = createFormGroup({
    firstName: INIT_INPUT_VALUE,
  });

  return (
    <>
      <p data-testid="value">{form().firstName}</p>
      <form use:formGroup={[form, setForm]}>
        <label htmlFor="firstName">First name</label>
        <input data-testid="input" id="firstName" type="text" formControlName="firstName" />
      </form>
      <button data-testid="btn" onClick={() => setForm({ firstName: TEST_INPUT_VALUE })}>
        Change
      </button>
    </>
  );
};

describe('Input element with type="text" as form control', () => {
  beforeEach(() => {
    render(() => <TestApp />);
  });

  it('should init value with the one provided in createFormGroup', async () => {
    const firstNameEl = await screen.findByTestId('value');

    expect(firstNameEl.innerHTML).toBe(INIT_INPUT_VALUE);
  });

  it('should update form value when updating programmatically from outside the form', async () => {
    const firstNameEl = await screen.findByTestId('value');
    const buttonEl = await screen.findByTestId('btn');

    userEvent.click(buttonEl);

    expect(firstNameEl.innerHTML).toBe(TEST_INPUT_VALUE);
  });

  it('should update form value when on manual input', async () => {
    const firstNameEl = await screen.findByTestId('value');
    const inputEl = await screen.findByTestId('input');

    fireEvent.change(inputEl, { target: { value: '' } });
    userEvent.type(inputEl, TEST_INPUT_VALUE);

    expect(firstNameEl.innerHTML).toBe(TEST_INPUT_VALUE);
  });
});

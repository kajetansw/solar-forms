import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const INIT_INPUT_VALUE = false;
const TEST_INPUT_VALUE = true;

const TestApp = () => {
  const [form, setForm] = createFormGroup({
    acceptTerms: INIT_INPUT_VALUE as boolean,
  });

  return (
    <>
      <p data-testid="value">{String(form().acceptTerms)}</p>
      <form use:formGroup={[form, setForm]}>
        <label>Accept terms</label>
        <input type="checkbox" formControlName="acceptTerms" data-testid="input" />
      </form>
      <button data-testid="btn" onClick={() => setForm({ acceptTerms: TEST_INPUT_VALUE })}>
        Update
      </button>
    </>
  );
};

describe('Input element with type="checkbox" as form control', () => {
  beforeEach(() => {
    render(() => <TestApp />);
  });

  it('should init value with the one provided in createFormGroup', async () => {
    const $value = await screen.findByTestId('value');

    expect($value.innerHTML).toBe(String(INIT_INPUT_VALUE));
  });

  it('should update form value when updating programmatically from outside the form', async () => {
    const $value = await screen.findByTestId('value');
    const $button = await screen.findByTestId('btn');

    userEvent.click($button);

    expect($value.innerHTML).toBe(String(TEST_INPUT_VALUE));
  });

  it('should update form value when on manual input', async () => {
    const $value = await screen.findByTestId('value');
    const $input = await screen.findByTestId('input');

    userEvent.click($input);

    expect($value.innerHTML).toBe(String(TEST_INPUT_VALUE));
  });
});

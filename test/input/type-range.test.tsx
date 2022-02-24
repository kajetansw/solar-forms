import { createFormGroup, formGroup } from '../../src';
import { screen, render, fireEvent } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const INIT_INPUT_VALUE = 10;
const TEST_INPUT_INT_VALUE = 66;

const TestApp = () => {
  const [form, setForm] = createFormGroup({
    skillLevel: INIT_INPUT_VALUE,
  });

  return (
    <>
      <p data-testid="value">{form().skillLevel}</p>
      <form use:formGroup={[form, setForm]}>
        <label for="skillLevel">Skill level</label>
        <input data-testid="input" id="skillLevel" type="range" formControlName="skillLevel" />
      </form>
      <button data-testid="btn" onClick={() => setForm({ skillLevel: TEST_INPUT_INT_VALUE })}>
        Change
      </button>
    </>
  );
};

describe('Input element with type="range" as form control', () => {
  beforeEach(() => {
    render(() => <TestApp />);
  });

  it('should init value with the one provided in createFormGroup', async () => {
    const $value = await screen.findByTestId('value');

    expect($value.innerHTML).toBe(String(INIT_INPUT_VALUE));
  });

  it('should update form value with int when updating programmatically from outside the form', async () => {
    const $value = await screen.findByTestId('value');
    const buttonEl = await screen.findByTestId('btn');

    userEvent.click(buttonEl);

    expect($value.innerHTML).toBe(String(TEST_INPUT_INT_VALUE));
  });

  it('should update form value when user selects a value', async () => {
    const $value = await screen.findByTestId('value');
    const $input = await screen.findByTestId('input');
    const testValue = Math.floor(Math.random() * 100);

    fireEvent.input($input, { target: { value: testValue } });

    expect($value.innerHTML).toBe(String(testValue));
  });
});

import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const INIT_INPUT_VALUE = false;
const TEST_INPUT_VALUE = true;
const NULL = String(null);

const TestApp = () => {
  const [form, setForm] = createFormGroup({
    valueBoolean: INIT_INPUT_VALUE as boolean | null,
    valueNull: null,
  });

  return (
    <>
      <p data-testid="value">{String(form().valueBoolean)}</p>
      <p data-testid="value-null">{String(form().valueNull)}</p>
      <form use:formGroup={[form, setForm]}>
        <label>Value boolean</label>
        <input type="checkbox" formControlName="valueBoolean" data-testid="input" />
        <label>Value null</label>
        <input type="checkbox" formControlName="valueNull" data-testid="input-null" />
      </form>
      <button data-testid="btn" onClick={() => setForm({ ...form(), valueBoolean: TEST_INPUT_VALUE })}>
        Change valueBoolean
      </button>
      <button data-testid="btn-null" onClick={() => setForm({ ...form(), valueBoolean: null })}>
        Change valueBoolean to null
      </button>
    </>
  );
};

describe('Input element with type="checkbox" as form control', () => {
  let $valueBoolean: HTMLElement;
  let $valueNull: HTMLElement;
  let $inputWithBoolean: HTMLInputElement;
  let $inputWithNull: HTMLInputElement;
  let $changeToBooleanButton: HTMLElement;
  let $changeToNullButton: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueBoolean = await screen.findByTestId('value');
    $valueNull = await screen.findByTestId('value-null');
    $inputWithBoolean = (await screen.findByTestId('input')) as HTMLInputElement;
    $inputWithNull = (await screen.findByTestId('input-null')) as HTMLInputElement;
    $changeToBooleanButton = await screen.findByTestId('btn');
    $changeToNullButton = await screen.findByTestId('btn-null');
  });

  describe('should init value with the one provided in createFormGroup', () => {
    it('when value is boolean', () => {
      expect($valueBoolean.innerHTML).toBe(String(INIT_INPUT_VALUE));
      expect($inputWithBoolean.checked).toBe(INIT_INPUT_VALUE);
    });

    it('when value is null', () => {
      expect($valueNull.innerHTML).toBe(NULL);
      expect($inputWithNull.checked).toBe(false);
    });
  });

  describe('should update form value when updating programmatically from outside the form', () => {
    it('with boolean', async () => {
      userEvent.click($changeToBooleanButton);

      expect($valueBoolean.innerHTML).toBe(String(TEST_INPUT_VALUE));
    });

    it('with null', async () => {
      userEvent.click($changeToNullButton);

      expect($valueBoolean.innerHTML === NULL || $valueBoolean.innerHTML === '').toBeTruthy();
      expect($inputWithBoolean.checked).toBe(false);
    });
  });

  it('should update form value when on manual input', async () => {
    userEvent.click($inputWithBoolean);

    expect($valueBoolean.innerHTML).toBe(String(TEST_INPUT_VALUE));
    expect($inputWithBoolean.checked).toBe(TEST_INPUT_VALUE);
  });
});

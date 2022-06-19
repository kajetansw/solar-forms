import { createFormGroup, formGroup } from '../../src';
import { screen, render, fireEvent } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const INIT_INPUT_VALUE = 'Thomas' as string | null;
const TEST_INPUT_VALUE = 'test';
const NULL = String(null);

const TestApp = () => {
  const fg = createFormGroup({
    valueString: INIT_INPUT_VALUE,
    valueNull: null,
  });
  const [form, setForm] = fg.value;

  return (
    <>
      <p data-testid="value">{form().valueString}</p>
      <p data-testid="value-null">{String(form().valueNull)}</p>

      <form use:formGroup={fg}>
        <label for="valueString">valueString</label>
        <textarea data-testid="input" name="valueString" id="valueString" formControlName="valueString" />

        <label for="valueNull">First name null</label>
        <textarea data-testid="input-null" name="valueNull" id="valueNull" formControlName="valueNull" />
      </form>

      <button data-testid="btn" onClick={() => setForm((s) => ({ ...s, valueString: TEST_INPUT_VALUE }))}>
        Change valueString
      </button>
      <button data-testid="btn-null" onClick={() => setForm((s) => ({ ...s, valueString: null }))}>
        Change valueString to null
      </button>
    </>
  );
};

describe('Values for `textarea` elements', () => {
  let $valueString: HTMLElement;
  let $valueNull: HTMLElement;
  let $inputWithString: HTMLTextAreaElement;
  let $inputWithNull: HTMLTextAreaElement;
  let $changeToStringButton: HTMLElement;
  let $changeToNullButton: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueString = await screen.findByTestId('value');
    $valueNull = await screen.findByTestId('value-null');
    $inputWithString = (await screen.findByTestId('input')) as HTMLTextAreaElement;
    $inputWithNull = (await screen.findByTestId('input-null')) as HTMLTextAreaElement;
    $changeToStringButton = await screen.findByTestId('btn');
    $changeToNullButton = await screen.findByTestId('btn-null');
  });

  describe('should init value with the one provided in createFormGroup', () => {
    it('when value is string', () => {
      expect($valueString.innerHTML).toBe(INIT_INPUT_VALUE);
      expect($inputWithString.value).toBe(INIT_INPUT_VALUE);
    });

    it('when value is null', () => {
      expect($valueNull.innerHTML).toBe(NULL);
      expect($inputWithNull.value).toBe('');
    });
  });

  describe('should update form value when updating programmatically from outside the form', () => {
    it('with string', () => {
      userEvent.click($changeToStringButton);

      expect($valueString.innerHTML).toBe(TEST_INPUT_VALUE);
      expect($inputWithString.value).toBe(TEST_INPUT_VALUE);
    });

    it('with null', () => {
      userEvent.click($changeToNullButton);

      expect($valueString.innerHTML === NULL || $valueString.innerHTML === '').toBeTruthy();
      expect($inputWithString.value).toBe('');
    });
  });

  it('should update form value when on manual input', () => {
    fireEvent.change($inputWithString, { target: { value: '' } });
    userEvent.type($inputWithString, TEST_INPUT_VALUE);

    expect($valueString.innerHTML).toBe(TEST_INPUT_VALUE);
  });
});

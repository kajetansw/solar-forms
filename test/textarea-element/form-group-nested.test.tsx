import { createFormGroup, formGroup } from '../../src';
import { screen, render, fireEvent } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import getRandomString from '../utils/get-random-string';

const INIT_INPUT_STRING_VALUE = getRandomString();
const TEST_INPUT_STRING_VALUE = getRandomString();

const TestApp = () => {
  const fg = createFormGroup({
    value: {
      nested1: INIT_INPUT_STRING_VALUE,
      nested2: {
        nested21: INIT_INPUT_STRING_VALUE,
      },
    },
  });
  const [form, setForm] = fg.value;

  return (
    <>
      <p data-testid="value-nested1">{form().value.nested1}</p>
      <p data-testid="value-nested21">{form().value.nested2.nested21}</p>

      <form use:formGroup={fg}>
        <div formGroupName="value">
          <label for="value">First name</label>
          <textarea data-testid="input-nested1" name="value" id="value" formControlName="nested1" />

          <span formGroupName="nested2">
            <label for="value">First name</label>
            <textarea data-testid="input-nested21" name="value" id="value" formControlName="nested21" />
          </span>
        </div>
      </form>

      <button
        data-testid="btn-nested1"
        onClick={() => setForm({ ...form(), value: { ...form().value, nested1: TEST_INPUT_STRING_VALUE } })}
      >
        Change nested1
      </button>
      <button
        data-testid="btn-nested21"
        onClick={() =>
          setForm({
            ...form(),
            value: {
              ...form().value,
              nested2: { ...form().value.nested2, nested21: TEST_INPUT_STRING_VALUE },
            },
          })
        }
      >
        Change nested21
      </button>
    </>
  );
};

describe('Nested form control with `textarea` elements', () => {
  let $valueNested1: HTMLElement;
  let $input1: HTMLTextAreaElement;
  let $changeNested1Value: HTMLElement;
  let $valueNested21: HTMLElement;
  let $input21: HTMLTextAreaElement;
  let $changeNested21Value: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueNested1 = await screen.findByTestId('value-nested1');
    $valueNested21 = await screen.findByTestId('value-nested21');
    $input1 = (await screen.findByTestId('input-nested1')) as HTMLTextAreaElement;
    $input21 = (await screen.findByTestId('input-nested21')) as HTMLTextAreaElement;
    $changeNested1Value = await screen.findByTestId('btn-nested1');
    $changeNested21Value = await screen.findByTestId('btn-nested21');
  });

  describe('should init value with the one provided in createFormGroup', () => {
    it('for value nested on lvl 1', () => {
      expect($valueNested1.innerHTML).toBe(INIT_INPUT_STRING_VALUE);
      expect($input1.value).toBe(INIT_INPUT_STRING_VALUE);
    });

    it('for value nested on lvl 2', () => {
      expect($valueNested21.innerHTML).toBe(INIT_INPUT_STRING_VALUE);
      expect($input21.value).toBe(INIT_INPUT_STRING_VALUE);
    });
  });

  describe('should update form value when updating programmatically from outside the form', () => {
    it('for value nested on lvl 1', () => {
      userEvent.click($changeNested1Value);

      expect($valueNested1.innerHTML).toBe(TEST_INPUT_STRING_VALUE);
      expect($input1.value).toBe(TEST_INPUT_STRING_VALUE);
    });

    it('for value nested on lvl 2', () => {
      userEvent.click($changeNested21Value);

      expect($valueNested21.innerHTML).toBe(TEST_INPUT_STRING_VALUE);
      expect($input21.value).toBe(TEST_INPUT_STRING_VALUE);
    });
  });

  describe('should update form value when on manual input', () => {
    it('for value nested on lvl 1', () => {
      fireEvent.change($input1, { target: { value: '' } });
      userEvent.type($input1, TEST_INPUT_STRING_VALUE);

      expect($valueNested1.innerHTML).toBe(TEST_INPUT_STRING_VALUE);
    });

    it('for value nested on lvl 2', () => {
      fireEvent.change($input21, { target: { value: '' } });
      userEvent.type($input21, TEST_INPUT_STRING_VALUE);

      expect($valueNested21.innerHTML).toBe(TEST_INPUT_STRING_VALUE);
    });
  });
});

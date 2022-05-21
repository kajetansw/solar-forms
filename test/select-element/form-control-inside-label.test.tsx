import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { Team, TEAMS } from '../utils/get-random-team';
import { For } from 'solid-js';

const INIT_INPUT_VALUE = TEAMS[0] as Team | null;
const TEST_INPUT_VALUE = TEAMS[1] as Team | null;
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
        <label for="valueString">
          valueString
          <select data-testid="select" name="valueString" id="valueString" formControlName="valueString">
            <For each={TEAMS}>
              {(t) => (
                <option data-testid={`valueString-${t}`} value={t}>
                  {t}
                </option>
              )}
            </For>
          </select>
        </label>

        <label for="valueNull">
          valueNull
          <select data-testid="select-null" name="valueNull" id="valueNull" formControlName="valueNull">
            <For each={TEAMS}>
              {(t) => (
                <option data-testid={`valueNull-${t}`} value={t}>
                  {t}
                </option>
              )}
            </For>
          </select>
        </label>
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

describe('Label with input element as child', () => {
  let $valueString: HTMLElement;
  let $valueNull: HTMLElement;
  let $selectWithString: HTMLSelectElement;
  let $selectWithStringProductOption: HTMLOptionElement;
  let $selectWithNull: HTMLSelectElement;
  let $changeToStringButton: HTMLElement;
  let $changeToNullButton: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueString = await screen.findByTestId('value');
    $valueNull = await screen.findByTestId('value-null');
    $selectWithString = (await screen.findByTestId('select')) as HTMLSelectElement;
    $selectWithStringProductOption = (await screen.findByTestId('valueString-product')) as HTMLOptionElement;
    $selectWithNull = (await screen.findByTestId('select-null')) as HTMLSelectElement;
    $changeToStringButton = await screen.findByTestId('btn');
    $changeToNullButton = await screen.findByTestId('btn-null');
  });

  describe('should init value with the one provided in createFormGroup', () => {
    it('when value is string', () => {
      expect($valueString.innerHTML).toBe(INIT_INPUT_VALUE);
      expect($selectWithString.value).toBe(INIT_INPUT_VALUE);
    });

    it('when form control value is null, first option is selected', () => {
      expect($valueNull.innerHTML).toBe(NULL);
      expect($selectWithNull.value).toBe(TEAMS[0]);
    });
  });

  describe('should update form value when updating programmatically from outside the form', () => {
    it('with string', () => {
      userEvent.click($changeToStringButton);

      expect($valueString.innerHTML).toBe(TEST_INPUT_VALUE);
      expect($selectWithString.value).toBe(TEST_INPUT_VALUE);
    });

    it('with null', () => {
      userEvent.click($changeToNullButton);

      expect($valueString.innerHTML === NULL || $valueString.innerHTML === '').toBeTruthy();
      expect($selectWithString.value).toBe('');
    });
  });

  it('should update form value on manual input', () => {
    userEvent.selectOptions($selectWithString, $selectWithStringProductOption);

    expect($valueString.innerHTML).toBe('product');
  });
});

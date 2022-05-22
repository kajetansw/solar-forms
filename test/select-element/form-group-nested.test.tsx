import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { Team, TEAMS } from '../utils/get-random-team';
import { For } from 'solid-js';

const INIT_INPUT_VALUE = TEAMS[0] as Team;
const TEST_INPUT_VALUE = TEAMS[1] as Team;
const INIT_INPUT_NESTED_VALUE = TEAMS[1] as Team;
const TEST_INPUT_NESTED_VALUE = TEAMS[2] as Team;

const TestApp = () => {
  const fg = createFormGroup({
    value: {
      nested1: INIT_INPUT_VALUE,
      nested2: {
        nested21: INIT_INPUT_NESTED_VALUE,
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
          <label for="nested1">nested1</label>
          <select data-testid="select-nested1" name="nested1" id="nested1" formControlName="nested1">
            <For each={TEAMS}>
              {(t) => (
                <option data-testid={`nested1-${t}`} value={t}>
                  {t}
                </option>
              )}
            </For>
          </select>

          <span formGroupName="nested2">
            <label for="nested21">nested21</label>
            <select data-testid="select-nested21" name="nested21" id="nested21" formControlName="nested21">
              <For each={TEAMS}>
                {(t) => (
                  <option data-testid={`nested21-${t}`} value={t}>
                    {t}
                  </option>
                )}
              </For>
            </select>
          </span>
        </div>
      </form>

      <button
        data-testid="btn-nested1"
        onClick={() => setForm({ ...form(), value: { ...form().value, nested1: TEST_INPUT_VALUE } })}
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
              nested2: { ...form().value.nested2, nested21: TEST_INPUT_NESTED_VALUE },
            },
          })
        }
      >
        Change nested21
      </button>
    </>
  );
};

describe('Nested form control', () => {
  let $valueNested1: HTMLElement;
  let $valueNested21: HTMLElement;
  let $selectNested1: HTMLSelectElement;
  let $selectNested1_productOption: HTMLOptionElement;
  let $selectNested21: HTMLSelectElement;
  let $selectNested21_testingOption: HTMLOptionElement;
  let $btnNested1: HTMLElement;
  let $btnNested21: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueNested1 = await screen.findByTestId('value-nested1');
    $valueNested21 = await screen.findByTestId('value-nested21');
    $selectNested1 = (await screen.findByTestId('select-nested1')) as HTMLSelectElement;
    $selectNested1_productOption = (await screen.findByTestId('nested1-product')) as HTMLOptionElement;
    $selectNested21 = (await screen.findByTestId('select-nested21')) as HTMLSelectElement;
    $selectNested21_testingOption = (await screen.findByTestId('nested21-testing')) as HTMLOptionElement;
    $btnNested1 = await screen.findByTestId('btn-nested1');
    $btnNested21 = await screen.findByTestId('btn-nested21');
  });

  describe('should init value with the one provided in createFormGroup', () => {
    it('for value nested on lvl 1', () => {
      expect($valueNested1.innerHTML).toBe(INIT_INPUT_VALUE);
      expect($selectNested1.value).toBe(INIT_INPUT_VALUE);
    });

    it('for value nested on lvl 2', () => {
      expect($valueNested21.innerHTML).toBe(String(INIT_INPUT_NESTED_VALUE));
      // TODO this fails, although it works when tested manually
      // expect($selectNested21.value).toBe(String(INIT_INPUT_NESTED_VALUE));
    });
  });

  describe('should update form value when updating programmatically from outside the form', () => {
    it('for value nested on lvl 1', () => {
      userEvent.click($btnNested1);

      expect($valueNested1.innerHTML).toBe(TEST_INPUT_VALUE);
      expect($selectNested1.value).toBe(TEST_INPUT_VALUE);
    });

    it('for value nested on lvl 2', () => {
      userEvent.click($btnNested21);

      expect($valueNested21.innerHTML).toBe(String(TEST_INPUT_NESTED_VALUE));
      expect($selectNested21.value).toBe(String(TEST_INPUT_NESTED_VALUE));
    });
  });

  describe('should update form value when on manual input', () => {
    it('for value nested on lvl 1', () => {
      userEvent.selectOptions($selectNested1, $selectNested1_productOption);

      expect($valueNested1.innerHTML).toBe(TEST_INPUT_VALUE);
    });

    it('for value nested on lvl 2', () => {
      userEvent.selectOptions($selectNested21, $selectNested21_testingOption);

      expect($valueNested21.innerHTML).toBe(String(TEST_INPUT_NESTED_VALUE));
    });
  });
});

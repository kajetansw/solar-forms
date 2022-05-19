import { createFormGroup, FormControl, formGroup, Validators as V } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import getRandomTeam, { TEAMS } from '../utils/get-random-team';
import { For } from 'solid-js';

const INIT_VALUE = '';
const TEST_VALUE = getRandomTeam();

const TRUE = String(true);
const FALSE = String(false);

const TestApp = () => {
  const fg = createFormGroup({
    value1: INIT_VALUE,
    value2: [INIT_VALUE, { validators: [V.required] }],
    value3: {
      value31: INIT_VALUE,
      value32: [INIT_VALUE, { validators: [V.required] }],
    },
  });
  const [form, setForm] = fg.value;
  const validAll = fg.validAll;

  return (
    <>
      <p data-testid="valid-all">{String(validAll())}</p>

      <form use:formGroup={fg}>
        <label for="value1">value1</label>
        <select data-testid="select-value1" name="value1" id="value1" formControlName="value1">
          <option data-testid="value1-init" value="">
            -- Please choose your team --
          </option>
          <For each={TEAMS}>
            {(t) => (
              <option data-testid={`value1-${t}`} value={t}>
                {t}
              </option>
            )}
          </For>
        </select>

        <label for="value2">value2</label>
        <select data-testid="select-value2" name="value2" id="value2" formControlName="value2">
          <option data-testid="value2-init" value="">
            -- Please choose your team --
          </option>
          <For each={TEAMS}>
            {(t) => (
              <option data-testid={`value2-${t}`} value={t}>
                {t}
              </option>
            )}
          </For>
        </select>

        <div formGroupName="value3">
          <label for="value31">value31</label>
          <select data-testid="select-value31" name="value31" id="value31" formControlName="value31">
            <option data-testid="value31-init" value="">
              -- Please choose your team --
            </option>
            <For each={TEAMS}>
              {(t) => (
                <option data-testid={`value31-${t}`} value={t}>
                  {t}
                </option>
              )}
            </For>
          </select>

          <label for="value32">value32</label>
          <select data-testid="select-value32" name="value32" id="value32" formControlName="value32">
            <option data-testid="value32-init" value="">
              -- Please choose your team --
            </option>
            <For each={TEAMS}>
              {(t) => (
                <option data-testid={`value32-${t}`} value={t}>
                  {t}
                </option>
              )}
            </For>
          </select>
        </div>
      </form>

      <button data-testid="btn-change-value1" onClick={() => setForm({ ...form(), value1: TEST_VALUE })}>
        Change value1
      </button>
      <button data-testid="btn-change-value2" onClick={() => setForm({ ...form(), value2: TEST_VALUE })}>
        Change value2
      </button>

      <button
        data-testid="btn-change-value31"
        onClick={() => setForm({ ...form(), value3: { ...form().value3, value31: TEST_VALUE } })}
      >
        Change value31
      </button>
      <button
        data-testid="btn-change-value32"
        onClick={() => setForm({ ...form(), value3: { ...form().value3, value32: TEST_VALUE } })}
      >
        Change value32
      </button>
    </>
  );
};

describe('Reading and marking form controls and groups as touched or untouched', () => {
  let $validAll: HTMLElement;
  let $selectValue2: HTMLSelectElement;
  let $selectValue2_productOption: HTMLOptionElement;
  let $selectValue32: HTMLSelectElement;
  let $selectValue32_productOption: HTMLOptionElement;
  let $btnChangeValue1: HTMLElement;
  let $btnChangeValue2: HTMLElement;
  let $btnChangeValue31: HTMLElement;
  let $btnChangeValue32: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $validAll = await screen.findByTestId('valid-all');
    $selectValue2 = (await screen.findByTestId('select-value2')) as HTMLSelectElement;
    $selectValue2_productOption = (await screen.findByTestId('value2-product')) as HTMLOptionElement;
    $selectValue32 = (await screen.findByTestId('select-value32')) as HTMLSelectElement;
    $selectValue32_productOption = (await screen.findByTestId('value32-product')) as HTMLOptionElement;
    $btnChangeValue1 = await screen.findByTestId('btn-change-value1');
    $btnChangeValue2 = await screen.findByTestId('btn-change-value2');
    $btnChangeValue31 = await screen.findByTestId('btn-change-value31');
    $btnChangeValue32 = await screen.findByTestId('btn-change-value32');
  });

  it('should mark "validAll" as "false" when at least one form control is invalid', function () {
    expect($validAll.innerHTML).toBe(FALSE);
  });

  it('should mark form group as valid when form control values are changed to valid programmatically from outside the form', function () {
    userEvent.click($btnChangeValue1);
    userEvent.click($btnChangeValue2);
    userEvent.click($btnChangeValue31);
    userEvent.click($btnChangeValue32);

    expect($validAll.innerHTML).toBe(TRUE);
  });

  it('should mark form group as valid when form control values are changed from UI to valid ones', function () {
    userEvent.selectOptions($selectValue2, $selectValue2_productOption);
    userEvent.selectOptions($selectValue32, $selectValue32_productOption);

    expect($validAll.innerHTML).toBe(TRUE);
  });
});

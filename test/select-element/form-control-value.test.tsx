import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import getRandomTeam, { Team, TEAMS } from '../utils/get-random-team';
import { For } from 'solid-js';

const INIT_INPUT_VALUE = TEAMS[0] as Team | null;
const NULL = String(null);

let randomTeam = getRandomTeam();

const TestApp = () => {
  const fg = createFormGroup({
    team: INIT_INPUT_VALUE,
  });
  const [form, setForm] = fg.value;

  return (
    <>
      <p data-testid="value">{form().team}</p>

      <form use:formGroup={fg}>
        <select data-testid="select-value" name="value" id="value" formControlName="team">
          <For each={TEAMS}>
            {(t) => (
              <option data-testid={`value-${t}`} value={t}>
                {t}
              </option>
            )}
          </For>
        </select>
      </form>

      <button data-testid="btn" onClick={() => setForm({ team: randomTeam })}>
        Update
      </button>
      <button data-testid="btn-null" onClick={() => setForm({ team: null })}>
        Update to null
      </button>
    </>
  );
};

describe('Input element with type="radio" as form control', () => {
  let $value: HTMLElement;
  let $changeToStringButton: HTMLElement;
  let $changeToNullButton: HTMLElement;
  let $selectValue: HTMLSelectElement;
  let $selectValue_productOption: HTMLOptionElement;

  beforeEach(async () => {
    render(() => <TestApp />);
    randomTeam = getRandomTeam();

    $value = await screen.findByTestId('value');
    $changeToStringButton = await screen.findByTestId('btn');
    $changeToNullButton = await screen.findByTestId('btn-null');
    $selectValue = (await screen.findByTestId('select-value')) as HTMLSelectElement;
    $selectValue_productOption = (await screen.findByTestId('value-product')) as HTMLOptionElement;
  });

  it('should init value with the one provided in createFormGroup', async () => {
    expect($value.innerHTML).toBe(INIT_INPUT_VALUE);
  });

  describe('should update form value when updating programmatically from outside the form', () => {
    it('with string', async () => {
      userEvent.click($changeToStringButton);

      expect($value.innerHTML).toBe(randomTeam);
    });

    it('with null', () => {
      userEvent.click($changeToNullButton);

      expect($value.innerHTML === NULL || $value.innerHTML === '').toBeTruthy();
    });
  });

  it('should update form value when on manual input', async () => {
    userEvent.selectOptions($selectValue, $selectValue_productOption);

    expect($value.innerHTML).toBe('product');
  });
});

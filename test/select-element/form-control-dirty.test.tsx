import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import { For } from 'solid-js';
import userEvent from '@testing-library/user-event';
import { TEAMS } from '../utils/get-random-team';

const INIT_VALUE = TEAMS[0] as string;
const TEST_VALUE = TEAMS[1] as string;

const TestApp = () => {
  const fg = createFormGroup({
    value1: INIT_VALUE,
    value2: {
      value21: INIT_VALUE,
    },
  });
  const [form, setForm] = fg.value;
  const [dirty, setDirty] = fg.dirty;

  return (
    <>
      <p data-testid="dirty1">{String(dirty().value1)}</p>
      <p data-testid="dirty21">{String(dirty().value2.value21)}</p>

      <form use:formGroup={fg}>
        <label for="value1">value1</label>
        <select data-testid="select-value1" name="value1" id="value1" formControlName="value1">
          <For each={TEAMS}>
            {(t) => (
              <option data-testid={`value1-${t}`} value={t}>
                {t}
              </option>
            )}
          </For>
        </select>

        <div formGroupName="value2">
          <label for="value21">value21</label>
          <select data-testid="select-value21" name="value21" id="value21" formControlName="value21">
            <For each={TEAMS}>
              {(t) => (
                <option data-testid={`value21-${t}`} value={t}>
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

      <button
        data-testid="btn-change-value21"
        onClick={() => setForm({ ...form(), value2: { value21: TEST_VALUE } })}
      >
        Change value21
      </button>

      <button data-testid="btn-mark-dirty-value1" onClick={() => setDirty({ ...dirty(), value1: true })}>
        Mark value1 dirty
      </button>

      <button
        data-testid="btn-mark-dirty-value21"
        onClick={() => setDirty({ ...dirty(), value2: { value21: true } })}
      >
        Mark value21 dirty
      </button>
    </>
  );
};

describe('Reading and marking form controls and groups as dirty', () => {
  let $dirty1: HTMLElement;
  let $dirty21: HTMLElement;
  let $selectValue1: HTMLInputElement;
  let $selectValue1ProductOption: HTMLInputElement;
  let $selectValue21: HTMLInputElement;
  let $selectValue21ProductOption: HTMLInputElement;
  let $btnValue1: HTMLElement;
  let $btnValue21: HTMLElement;
  let $btnMarkDirtyValue1: HTMLElement;
  let $btnMarkDirtyValue21: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $dirty1 = await screen.findByTestId('dirty1');
    $dirty21 = await screen.findByTestId('dirty21');
    $selectValue1 = (await screen.findByTestId('select-value1')) as HTMLInputElement;
    $selectValue1ProductOption = (await screen.findByTestId('value1-product')) as HTMLInputElement;
    $selectValue21 = (await screen.findByTestId('select-value21')) as HTMLInputElement;
    $selectValue21ProductOption = (await screen.findByTestId('value21-product')) as HTMLInputElement;
    $btnValue1 = await screen.findByTestId('btn-change-value1');
    $btnValue21 = await screen.findByTestId('btn-change-value21');
    $btnMarkDirtyValue1 = await screen.findByTestId('btn-mark-dirty-value1');
    $btnMarkDirtyValue21 = await screen.findByTestId('btn-mark-dirty-value21');
  });

  describe('should set control as pristine (not dirty) when initialized', () => {
    it('for top-level control', () => {
      expect($dirty1.innerHTML).toBe(String(false));
    });

    it('for nested control', () => {
      expect($dirty21.innerHTML).toBe(String(false));
    });
  });

  describe('should change control to dirty when input value is changed from UI', () => {
    it('for top-level control', () => {
      userEvent.selectOptions($selectValue1, $selectValue1ProductOption);

      expect($dirty1.innerHTML).toBe(String(true));
    });

    it('for nested control', () => {
      userEvent.selectOptions($selectValue21, $selectValue21ProductOption);

      expect($dirty21.innerHTML).toBe(String(true));
    });
  });

  describe('should NOT change control to dirty when input value is changed programmatically from outside the form', () => {
    it('for top-level control', () => {
      userEvent.click($btnValue1);

      expect($dirty1.innerHTML).toBe(String(false));
    });

    it('for nested control', () => {
      userEvent.click($btnValue21);

      expect($dirty21.innerHTML).toBe(String(false));
    });
  });

  describe('should change control to dirty when changed programmatically from outside the form', () => {
    it('for top-level control', () => {
      userEvent.click($btnMarkDirtyValue1);

      expect($dirty1.innerHTML).toBe(String(true));
    });

    it('for nested control', () => {
      userEvent.click($btnMarkDirtyValue21);

      expect($dirty21.innerHTML).toBe(String(true));
    });
  });
});

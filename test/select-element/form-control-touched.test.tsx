import { createFormGroup, formGroup } from '../../src';
import { screen, render, fireEvent } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { For } from 'solid-js';
import getRandomTeam, { TEAMS } from '../utils/get-random-team';

const INIT_VALUE = getRandomTeam();

const TestApp = () => {
  const fg = createFormGroup({
    value1: INIT_VALUE,
    value2: {
      value21: INIT_VALUE,
    },
  });
  const [touched, setTouched] = fg.touched;

  return (
    <>
      <p data-testid="touched1">{String(touched().value1)}</p>
      <p data-testid="touched21">{String(touched().value2.value21)}</p>

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

      <button
        data-testid="btn-mark-touched-value1"
        onClick={() => setTouched({ ...touched(), value1: true })}
      >
        Mark value1 touched
      </button>

      <button
        data-testid="btn-mark-touched-value21"
        onClick={() => setTouched({ ...touched(), value2: { value21: true } })}
      >
        Mark value21 touched
      </button>
    </>
  );
};

describe('Reading and marking form controls and groups as touched or untouched', () => {
  let $touched1: HTMLElement;
  let $touched21: HTMLElement;
  let $selectValue1: HTMLInputElement;
  let $selectValue21: HTMLInputElement;
  let $btnMarkTouchedValue1: HTMLElement;
  let $btnMarTouchedValue21: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $touched1 = await screen.findByTestId('touched1');
    $touched21 = await screen.findByTestId('touched21');
    $selectValue1 = (await screen.findByTestId('select-value1')) as HTMLInputElement;
    $selectValue21 = (await screen.findByTestId('select-value21')) as HTMLInputElement;
    $btnMarkTouchedValue1 = await screen.findByTestId('btn-mark-touched-value1');
    $btnMarTouchedValue21 = await screen.findByTestId('btn-mark-touched-value21');
  });

  describe('should set control as untouched when initialized', () => {
    it('for top-level control', () => {
      expect($touched1.innerHTML).toBe(String(false));
    });

    it('for nested control', () => {
      expect($touched21.innerHTML).toBe(String(false));
    });
  });

  describe('should change control to dirty when form control loses focus (blur event)', () => {
    it('for top-level control', () => {
      fireEvent.focus($selectValue1);
      fireEvent.blur($selectValue1);

      expect($touched1.innerHTML).toBe(String(true));
    });

    it('for nested control', () => {
      fireEvent.focus($selectValue21);
      fireEvent.blur($selectValue21);

      expect($touched21.innerHTML).toBe(String(true));
    });
  });

  describe('should change control to touched when changed programmatically from outside the form', () => {
    it('for top-level control', () => {
      userEvent.click($btnMarkTouchedValue1);

      expect($touched1.innerHTML).toBe(String(true));
    });

    it('for nested control', () => {
      userEvent.click($btnMarTouchedValue21);

      expect($touched21.innerHTML).toBe(String(true));
    });
  });
});

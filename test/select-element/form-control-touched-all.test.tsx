import { createFormGroup, formGroup } from '../../src';
import { screen, render, fireEvent } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import getRandomTeam, { TEAMS } from '../utils/get-random-team';
import { For } from 'solid-js';

const INIT_VALUE = getRandomTeam();

const TestApp = () => {
  const fg = createFormGroup({
    value1: INIT_VALUE,
    value2: {
      value21: INIT_VALUE,
    },
  });
  const [touched, setTouched] = fg.touched;
  const [touchedAll, setTouchedAll] = fg.touchedAll;

  return (
    <>
      <p data-testid="value-touchedAll">{JSON.stringify(touchedAll())}</p>

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

      <button data-testid="btn-mark-all-touched" onClick={() => setTouchedAll(true)}>
        Mark all as touched
      </button>
      <button data-testid="btn-mark-all-untouched" onClick={() => setTouchedAll(false)}>
        Mark all as untouched
      </button>
      <button
        data-testid="btn-mark-each-touched"
        onClick={() => setTouched({ ...touched(), value1: true, value2: { value21: true } })}
      >
        Mark each as touched
      </button>
    </>
  );
};

describe('Marking all form controls and groups as touched or untouched', () => {
  let $valueTouchedAll: HTMLElement;
  let $selectValue1: HTMLSelectElement;
  let $selectValue21: HTMLSelectElement;
  let $btnMarkAllTouched: HTMLElement;
  let $btnMarkAllUntouched: HTMLElement;
  let $btnMarkEachTouched: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueTouchedAll = await screen.findByTestId('value-touchedAll');
    $selectValue1 = (await screen.findByTestId('select-value1')) as HTMLSelectElement;
    $selectValue21 = (await screen.findByTestId('select-value21')) as HTMLSelectElement;
    $btnMarkAllTouched = await screen.findByTestId('btn-mark-all-touched');
    $btnMarkAllUntouched = await screen.findByTestId('btn-mark-all-untouched');
    $btnMarkEachTouched = await screen.findByTestId('btn-mark-each-touched');
  });

  it('should read touchedAll value as "false" initially', () => {
    expect($valueTouchedAll.innerHTML).toBe(String(false));
  });

  it('should read touchedAll value as "false" when not all form controls are touched', () => {
    fireEvent.focus($selectValue1);
    fireEvent.blur($selectValue1);

    expect($valueTouchedAll.innerHTML).toBe(String(false));
  });

  it('should read touchedAll value as "true" when all controls had blur event dispatched', () => {
    fireEvent.focus($selectValue1);
    fireEvent.blur($selectValue1);
    fireEvent.focus($selectValue21);
    fireEvent.blur($selectValue21);

    expect($valueTouchedAll.innerHTML).toBe(String(true));
  });

  it('should read touchedAll value as "true" when all controls were marked as touched programmatically from outside the form', () => {
    userEvent.click($btnMarkEachTouched);

    expect($valueTouchedAll.innerHTML).toBe(String(true));
  });

  it('should mark all form controls as touched when setting the property programmatically from outside the form', () => {
    userEvent.click($btnMarkAllTouched);

    expect($valueTouchedAll.innerHTML).toBe(String(true));
  });

  it('should read touchedAll value as "false" when setting the touched property programmatically to "false" from outside the form', () => {
    userEvent.click($btnMarkAllTouched);
    userEvent.click($btnMarkAllUntouched);

    expect($valueTouchedAll.innerHTML).toBe(String(false));
  });
});

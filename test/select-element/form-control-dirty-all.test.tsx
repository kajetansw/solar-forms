import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { TEAMS } from '../utils/get-random-team';
import { For } from 'solid-js';

const INIT_VALUE = TEAMS[0] as string;

const TestApp = () => {
  const fg = createFormGroup({
    value1: INIT_VALUE,
    value2: {
      value21: INIT_VALUE,
    },
  });
  const [dirty, setDirty] = fg.dirty;
  const [dirtyAll, setDirtyAll] = fg.dirtyAll;

  return (
    <>
      <p data-testid="value-dirtyAll">{JSON.stringify(dirtyAll())}</p>

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

      <button data-testid="btn-mark-all-dirty" onClick={() => setDirtyAll(true)}>
        Mark all as dirty
      </button>
      <button data-testid="btn-mark-all-pristine" onClick={() => setDirtyAll(false)}>
        Mark all as pristine
      </button>
      <button
        data-testid="btn-mark-each-dirty"
        onClick={() => setDirty({ ...dirty(), value1: true, value2: { value21: true } })}
      >
        Mark each as dirty
      </button>
    </>
  );
};

describe('Marking all form controls and groups as dirty or pristine', () => {
  let $valueDirtyAll: HTMLElement;
  let $selectValue1: HTMLInputElement;
  let $selectValue1ProductOption: HTMLInputElement;
  let $selectValue21: HTMLInputElement;
  let $selectValue21ProductOption: HTMLInputElement;
  let $btnMarkAllDirty: HTMLElement;
  let $btnMarkAllPristine: HTMLElement;
  let $btnMarkEachDirty: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueDirtyAll = await screen.findByTestId('value-dirtyAll');
    $selectValue1 = (await screen.findByTestId('select-value1')) as HTMLInputElement;
    $selectValue1ProductOption = (await screen.findByTestId('value1-product')) as HTMLInputElement;
    $selectValue21 = (await screen.findByTestId('select-value21')) as HTMLInputElement;
    $selectValue21ProductOption = (await screen.findByTestId('value21-product')) as HTMLInputElement;
    $btnMarkAllDirty = await screen.findByTestId('btn-mark-all-dirty');
    $btnMarkAllPristine = await screen.findByTestId('btn-mark-all-pristine');
    $btnMarkEachDirty = await screen.findByTestId('btn-mark-each-dirty');
  });

  it('should read dirtyAll value as "false" initially', () => {
    expect($valueDirtyAll.innerHTML).toBe(String(false));
  });

  it('should read dirtyAll value as "false" when not all form controls are dirty', () => {
    userEvent.selectOptions($selectValue1, $selectValue1ProductOption);

    expect($valueDirtyAll.innerHTML).toBe(String(false));
  });

  it('should read dirtyAll value as "true" when all controls were changed from UI', () => {
    userEvent.selectOptions($selectValue1, $selectValue1ProductOption);
    userEvent.selectOptions($selectValue21, $selectValue21ProductOption);

    expect($valueDirtyAll.innerHTML).toBe(String(true));
  });

  it('should read dirtyAll value as "true" when all controls were marked as dirty programmatically from outside the form', () => {
    userEvent.click($btnMarkEachDirty);

    expect($valueDirtyAll.innerHTML).toBe(String(true));
  });

  it('should disable all form controls when setting the property programmatically from outside the form', () => {
    userEvent.click($btnMarkAllDirty);

    expect($valueDirtyAll.innerHTML).toBe(String(true));
  });

  it('should read dirtyAll value as "false" when setting the touched property to "false" programmatically from outside the form', () => {
    userEvent.click($btnMarkAllDirty);
    userEvent.click($btnMarkAllPristine);

    expect($valueDirtyAll.innerHTML).toBe(String(false));
  });
});

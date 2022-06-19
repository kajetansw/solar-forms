import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import getRandomString from '../utils/get-random-string';

const INIT_VALUE = getRandomString();
const TEST_VALUE = getRandomString();

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
        <textarea data-testid="input-value1" name="value1" id="value1" formControlName="value1" />

        <div formGroupName="value2">
          <label for="value21">value21</label>
          <textarea data-testid="input-value21" name="value21" id="value21" formControlName="value21" />
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

describe('Marking all form controls and groups as dirty or pristine for `textarea` element', () => {
  let $valueDirtyAll: HTMLElement;
  let $inputValue1: HTMLTextAreaElement;
  let $inputValue21: HTMLTextAreaElement;
  let $btnMarkAllDirty: HTMLElement;
  let $btnMarkAllPristine: HTMLElement;
  let $btnMarkEachDirty: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueDirtyAll = await screen.findByTestId('value-dirtyAll');
    $inputValue1 = (await screen.findByTestId('input-value1')) as HTMLTextAreaElement;
    $inputValue21 = (await screen.findByTestId('input-value21')) as HTMLTextAreaElement;
    $btnMarkAllDirty = await screen.findByTestId('btn-mark-all-dirty');
    $btnMarkAllPristine = await screen.findByTestId('btn-mark-all-pristine');
    $btnMarkEachDirty = await screen.findByTestId('btn-mark-each-dirty');
  });

  it('should read dirtyAll value as "false" initially', () => {
    expect($valueDirtyAll.innerHTML).toBe(String(false));
  });

  it('should read dirtyAll value as "false" when not all form controls are dirty', () => {
    userEvent.type($inputValue1, TEST_VALUE);

    expect($valueDirtyAll.innerHTML).toBe(String(false));
  });

  it('should read dirtyAll value as "true" when all controls were changed from UI', () => {
    userEvent.type($inputValue1, TEST_VALUE);
    userEvent.type($inputValue21, TEST_VALUE);

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

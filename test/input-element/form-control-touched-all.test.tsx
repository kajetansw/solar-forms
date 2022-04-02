import { createFormGroup, formGroup } from '../../src';
import { screen, render, fireEvent } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import getRandomString from '../utils/get-random-string';

const INIT_VALUE = getRandomString();

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
        <input data-testid="input-value1" id="value1" type="text" formControlName="value1" />

        <div formGroupName="value2">
          <label for="value21">value21</label>
          <input data-testid="input-value21" id="value21" type="text" formControlName="value21" />
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
  let $inputValue1: HTMLInputElement;
  let $inputValue21: HTMLInputElement;
  let $btnMarkAllTouched: HTMLElement;
  let $btnMarkAllUntouched: HTMLElement;
  let $btnMarkEachTouched: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $valueTouchedAll = await screen.findByTestId('value-touchedAll');
    $inputValue1 = (await screen.findByTestId('input-value1')) as HTMLInputElement;
    $inputValue21 = (await screen.findByTestId('input-value21')) as HTMLInputElement;
    $btnMarkAllTouched = await screen.findByTestId('btn-mark-all-touched');
    $btnMarkAllUntouched = await screen.findByTestId('btn-mark-all-untouched');
    $btnMarkEachTouched = await screen.findByTestId('btn-mark-each-touched');
  });

  it('should read touchedAll value as "false" initially', () => {
    expect($valueTouchedAll.innerHTML).toBe(String(false));
  });

  it('should read touchedAll value as "false" when not all form controls are touched', () => {
    fireEvent.focus($inputValue1);
    fireEvent.blur($inputValue1);

    expect($valueTouchedAll.innerHTML).toBe(String(false));
  });

  it('should read touchedAll value as "true" when all controls had blur event dispatched', () => {
    fireEvent.focus($inputValue1);
    fireEvent.blur($inputValue1);
    fireEvent.focus($inputValue21);
    fireEvent.blur($inputValue21);

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

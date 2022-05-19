import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { For } from 'solid-js';
import { TEAMS } from '../utils/get-random-team';

const TestApp = () => {
  const fg = createFormGroup({
    controlEnabled1: ['test', { disabled: false }],
    controlDisabled2: ['test', { disabled: true }],
    control3: {
      controlEnabled31: ['test', { disabled: false }],
      controlDisabled32: ['test', { disabled: true }],
    },
  });
  const [disabledAll, setDisabledAll] = fg.disabledAll;

  return (
    <>
      <p data-testid="value-disabledAll">{JSON.stringify(disabledAll())}</p>

      <form use:formGroup={fg}>
        <label for="controlEnabled1">controlEnabled1</label>
        <select
          data-testid="select-controlEnabled1"
          name="controlEnabled1"
          id="controlEnabled1"
          formControlName="controlEnabled1"
        >
          <For each={TEAMS}>
            {(t) => (
              <option data-testid={`controlEnabled1-${t}`} value={t}>
                {t}
              </option>
            )}
          </For>
        </select>

        <label for="controlDisabled2">controlDisabled2</label>
        <select
          data-testid="select-controlDisabled2"
          name="controlDisabled2"
          id="controlDisabled2"
          formControlName="controlDisabled2"
        >
          <For each={TEAMS}>
            {(t) => (
              <option data-testid={`controlDisabled2-${t}`} value={t}>
                {t}
              </option>
            )}
          </For>
        </select>

        <div formGroupName="control3">
          <label for="controlEnabled31">controlEnabled31</label>
          <select
            data-testid="select-controlEnabled31"
            name="controlEnabled31"
            id="controlEnabled31"
            formControlName="controlEnabled31"
          >
            <For each={TEAMS}>
              {(t) => (
                <option data-testid={`controlEnabled31-${t}`} value={t}>
                  {t}
                </option>
              )}
            </For>
          </select>

          <label for="controlDisabled32">controlDisabled32</label>
          <select
            data-testid="select-controlDisabled32"
            name="controlDisabled32"
            id="controlDisabled32"
            formControlName="controlDisabled32"
          >
            <For each={TEAMS}>
              {(t) => (
                <option data-testid={`controlDisabled32-${t}`} value={t}>
                  {t}
                </option>
              )}
            </For>
          </select>
        </div>
      </form>

      <button data-testid="btn-disable-all" onClick={() => setDisabledAll(true)}>
        Disable all
      </button>
      <button data-testid="btn-enable-all" onClick={() => setDisabledAll(false)}>
        Enable all
      </button>
    </>
  );
};

describe('Disabling and enabling all form controls and groups', () => {
  let $controlEnabled1: HTMLInputElement;
  let $controlDisabled2: HTMLInputElement;
  let $controlEnabled31: HTMLInputElement;
  let $controlDisabled32: HTMLInputElement;
  let $btnDisableAll: HTMLElement;
  let $btnEnableAll: HTMLElement;
  let $valueDisabledAll: HTMLElement;

  const expectAllControlsToBe = (value: 'enabled' | 'disabled') => {
    const disabled = value === 'disabled';

    if (disabled) {
      expect($valueDisabledAll.innerHTML).toBe(String(disabled));
    }
    expect($controlEnabled1.disabled).toBe(disabled);
    expect($controlDisabled2.disabled).toBe(disabled);
    expect($controlDisabled32.disabled).toBe(disabled);
    expect($controlEnabled31.disabled).toBe(disabled);
  };

  beforeEach(async () => {
    render(() => <TestApp />);

    $controlEnabled1 = (await screen.findByTestId('select-controlEnabled1')) as HTMLInputElement;
    $controlDisabled2 = (await screen.findByTestId('select-controlDisabled2')) as HTMLInputElement;
    $controlEnabled31 = (await screen.findByTestId('select-controlEnabled31')) as HTMLInputElement;
    $controlDisabled32 = (await screen.findByTestId('select-controlDisabled32')) as HTMLInputElement;
    $btnDisableAll = await screen.findByTestId('btn-disable-all');
    $btnEnableAll = await screen.findByTestId('btn-enable-all');
    $valueDisabledAll = await screen.findByTestId('value-disabledAll');
  });

  it('should read disabledAll value as "false" when at least one form control is enabled', () => {
    expect($valueDisabledAll.innerHTML).toBe(String(false));
  });

  it('should disable all form controls when setting the property programmatically from outside the form', () => {
    userEvent.click($btnDisableAll);

    expectAllControlsToBe('disabled');
  });

  it('should enable all form controls when setting the property programmatically from outside the form', () => {
    userEvent.click($btnEnableAll);

    expectAllControlsToBe('enabled');
  });
});

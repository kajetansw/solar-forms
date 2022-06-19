import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const TestApp = () => {
  const fg = createFormGroup({
    controlEnabled: ['test', { disabled: false }],
    controlDisabled: ['test', { disabled: true }],
    nested: {
      controlEnabled: ['test', { disabled: false }],
      controlDisabled: ['test', { disabled: true }],
    },
  });
  const [disabledAll, setDisabledAll] = fg.disabledAll;

  return (
    <>
      <p data-testid="value-disabledAll">{JSON.stringify(disabledAll())}</p>

      <form use:formGroup={fg}>
        <label for="controlEnabled">controlEnabled</label>
        <textarea
          data-testid="input-controlEnabled"
          name="controlEnabled"
          id="controlEnabled"
          formControlName="controlEnabled"
        />

        <label for="controlDisabled">controlDisabled</label>
        <textarea
          data-testid="input-controlDisabled"
          name="controlDisabled"
          id="controlDisabled"
          formControlName="controlDisabled"
        />

        <div formGroupName="nested">
          <label for="controlEnabled">controlEnabled</label>
          <textarea
            data-testid="input-nested-controlEnabled"
            name="controlEnabled"
            id="controlEnabled"
            formControlName="controlEnabled"
          />

          <label for="controlDisabled">controlDisabled</label>
          <textarea
            data-testid="input-nested-controlDisabled"
            name="controlDisabled"
            id="controlDisabled"
            formControlName="controlDisabled"
          />
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

describe('Disabling and enabling all form controls and groups for `textarea` element', () => {
  let $controlEnabled: HTMLTextAreaElement;
  let $controlDisabled: HTMLTextAreaElement;
  let $nestedControlEnabled: HTMLTextAreaElement;
  let $nestedControlDisabled: HTMLTextAreaElement;
  let $btnDisableAll: HTMLElement;
  let $btnEnableAll: HTMLElement;
  let $valueDisabledAll: HTMLElement;

  const expectAllControlsToBe = (value: 'enabled' | 'disabled') => {
    const disabled = value === 'disabled';

    if (disabled) {
      expect($valueDisabledAll.innerHTML).toBe(String(disabled));
    }
    expect($controlEnabled.disabled).toBe(disabled);
    expect($controlDisabled.disabled).toBe(disabled);
    expect($nestedControlDisabled.disabled).toBe(disabled);
    expect($nestedControlEnabled.disabled).toBe(disabled);
  };

  beforeEach(async () => {
    render(() => <TestApp />);

    $controlEnabled = (await screen.findByTestId('input-controlEnabled')) as HTMLTextAreaElement;
    $controlDisabled = (await screen.findByTestId('input-controlDisabled')) as HTMLTextAreaElement;
    $nestedControlEnabled = (await screen.findByTestId('input-nested-controlEnabled')) as HTMLTextAreaElement;
    $nestedControlDisabled = (await screen.findByTestId(
      'input-nested-controlDisabled'
    )) as HTMLTextAreaElement;
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

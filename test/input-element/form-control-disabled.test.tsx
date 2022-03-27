import { createFormGroup, formGroup } from '../../src';
import { screen, render } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';

const TestApp = () => {
  const fg = createFormGroup({
    controlEnabled1: 'test',
    controlEnabled2: ['test', { disabled: false }],
    controlDisabled: ['test', { disabled: true }],
    nested: {
      controlEnabled1: 'test',
      controlEnabled2: ['test', { disabled: false }],
      controlDisabled: ['test', { disabled: true }],
    },
  });
  const [disabled, setDisabled] = fg.disabled;

  return (
    <>
      <form use:formGroup={fg}>
        <label for="controlEnabled1">controlEnabled1</label>
        <input
          data-testid="input-controlEnabled1"
          id="controlEnabled1"
          type="text"
          formControlName="controlEnabled1"
        />

        <label for="controlEnabled2">controlEnabled2</label>
        <input
          data-testid="input-controlEnabled2"
          id="controlEnabled2"
          type="text"
          formControlName="controlEnabled2"
        />

        <label for="controlDisabled">controlDisabled</label>
        <input
          data-testid="input-controlDisabled"
          id="controlDisabled"
          type="text"
          formControlName="controlDisabled"
        />

        <div formGroupName="nested">
          <label for="controlEnabled1">controlEnabled1</label>
          <input
            data-testid="input-nested-controlEnabled1"
            id="controlEnabled1"
            type="text"
            formControlName="controlEnabled1"
          />

          <label for="controlEnabled2">controlEnabled2</label>
          <input
            data-testid="input-nested-controlEnabled2"
            id="controlEnabled2"
            type="text"
            formControlName="controlEnabled2"
          />

          <label for="controlDisabled">controlDisabled</label>
          <input
            data-testid="input-nested-controlDisabled"
            id="controlDisabled"
            type="text"
            formControlName="controlDisabled"
          />
        </div>
      </form>

      <button
        data-testid="btn-controlEnabled1"
        onClick={() => setDisabled({ ...disabled(), controlEnabled1: true })}
      >
        Change controlEnabled1
      </button>

      <button
        data-testid="btn-controlEnabled2"
        onClick={() => setDisabled({ ...disabled(), controlEnabled2: true })}
      >
        Change controlEnabled2
      </button>

      <button
        data-testid="btn-nested-controlEnabled1"
        onClick={() =>
          setDisabled({ ...disabled(), nested: { ...disabled().nested, controlEnabled1: true } })
        }
      >
        Change nested controlEnabled1
      </button>

      <button
        data-testid="btn-nested-controlEnabled2"
        onClick={() =>
          setDisabled({ ...disabled(), nested: { ...disabled().nested, controlEnabled2: true } })
        }
      >
        Change nested controlEnabled2
      </button>
    </>
  );
};

describe('Disabling form controls and groups', () => {
  let $controlEnabled1: HTMLInputElement;
  let $controlEnabled2: HTMLInputElement;
  let $controlDisabled: HTMLInputElement;
  let $nestedControlEnabled1: HTMLInputElement;
  let $nestedControlEnabled2: HTMLInputElement;
  let $nestedControlDisabled: HTMLInputElement;
  let $btnControlEnabled1: HTMLElement;
  let $btnControlEnabled2: HTMLElement;
  let $btnNestedControlEnabled1: HTMLElement;
  let $btnNestedControlEnabled2: HTMLElement;

  beforeEach(async () => {
    render(() => <TestApp />);

    $controlEnabled1 = (await screen.findByTestId('input-controlEnabled1')) as HTMLInputElement;
    $controlEnabled2 = (await screen.findByTestId('input-controlEnabled2')) as HTMLInputElement;
    $controlDisabled = (await screen.findByTestId('input-controlDisabled')) as HTMLInputElement;
    $nestedControlEnabled1 = (await screen.findByTestId('input-nested-controlEnabled1')) as HTMLInputElement;
    $nestedControlEnabled2 = (await screen.findByTestId('input-nested-controlEnabled2')) as HTMLInputElement;
    $nestedControlDisabled = (await screen.findByTestId('input-nested-controlDisabled')) as HTMLInputElement;
    $btnControlEnabled1 = await screen.findByTestId('btn-controlEnabled1');
    $btnControlEnabled2 = await screen.findByTestId('btn-controlEnabled2');
    $btnNestedControlEnabled1 = await screen.findByTestId('btn-nested-controlEnabled1');
    $btnNestedControlEnabled2 = await screen.findByTestId('btn-nested-controlEnabled2');
  });

  describe('should set control to disabled when initialized as one', () => {
    it('for top-level control', () => {
      expect($controlDisabled.disabled).toBe(true);
    });

    it('for nested control', () => {
      expect($nestedControlDisabled.disabled).toBe(true);
    });
  });

  describe('should set control to enabled when initialized as one', () => {
    describe('for top-level control', () => {
      it('without config object', () => {
        expect($controlEnabled1.disabled).toBe(false);
      });

      it('with config object', () => {
        expect($controlEnabled2.disabled).toBe(false);
      });
    });

    describe('for nested control', () => {
      it('without config object', () => {
        expect($nestedControlEnabled1.disabled).toBe(false);
      });

      it('with config object', () => {
        expect($nestedControlEnabled2.disabled).toBe(false);
      });
    });
  });

  describe('should set control to disabled when programmatically set from outside the form', () => {
    describe('for top-level control', () => {
      it('without config object', () => {
        userEvent.click($btnControlEnabled1);
        expect($controlEnabled1.disabled).toBe(true);
      });

      it('with config object', () => {
        userEvent.click($btnControlEnabled2);
        expect($controlEnabled2.disabled).toBe(true);
      });
    });

    describe('for nested control', () => {
      it('without config object', () => {
        userEvent.click($btnNestedControlEnabled1);
        expect($nestedControlEnabled1.disabled).toBe(true);
      });

      it('with config object', () => {
        userEvent.click($btnNestedControlEnabled2);
        expect($nestedControlEnabled2.disabled).toBe(true);
      });
    });
  });
});
